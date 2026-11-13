from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from . import config
from .database import check_database, ensure_schema, get_connection
from .routers.auth import router as auth_router, current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify MySQL and create only the supporting auth tables.
    check_database()
    ensure_schema()
    print(f"FastAPI running. MySQL database '{config.DB_NAME}' connected.")
    yield

app = FastAPI(
    title="DermaCare AI API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.CLIENT_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # Keep the response shape expected by the existing React apiError() helper.
    if isinstance(exc.detail, dict) and "message" in exc.detail:
        body = exc.detail
    else:
        body = {"message": str(exc.detail)}
    return JSONResponse(status_code=exc.status_code, content=body, headers=exc.headers)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for item in exc.errors():
        loc = item.get("loc", [])
        field = str(loc[-1]) if loc else "form"
        if field not in errors:
            errors[field] = item.get("msg", "Invalid value.")
    return JSONResponse(
        status_code=422,
        content={"message": "Please fix the highlighted fields.", "errors": errors}
    )

@app.get("/api/health")
def health():
    try:
        check_database()
        return {"ok": True, "db": "connected"}
    except Exception as exc:
        print("health check error:", repr(exc))
        raise HTTPException(status_code=500, detail={"ok": False, "db": "unreachable"})

@app.get("/api/dashboard")
def dashboard(user=Depends(current_user)):
    return {"message": f"Welcome, {user['full_name']}", "user": {
        "id": user["id"], "full_name": user["full_name"], "email": user["email"]
    }}

@app.get("/")
def root():
    return {"message": "DermaCare AI FastAPI backend is running."}
