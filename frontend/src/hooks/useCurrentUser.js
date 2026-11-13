import { useNavigate } from "react-router-dom";

/**
 * ⚠️ YEH WAHID FILE HAI JISE AAPKO APNE AUTH SYSTEM SE CONNECT KARNA HAI.
 * Abhi yeh localStorage se "user" parh raha hai (Login ke baad aap yahan user save karte hain).
 * Agar aap AuthContext / Redux / cookies use kar rahe hain to sirf is file ka andar ka hissa
 * badal dein. Return shape wahi rakhein: { user, name, email, logout }.
 */
export default function useCurrentUser() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const name = user?.full_name || user?.name || "User";
  const email = user?.email || "";

  const logout = () => {
    // Apni existing logout logic yahan call karein (API call / context logout)
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return { user, name, email, logout };
}
