import React, { useCallback, useEffect, useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/globalContext";
import ToastMsg from "./ToastMsg";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
   const { doLogin, doRegistration, checkEmailAvailable } = useGlobalContext();
   const navigate = useNavigate();

   const [mode, setMode] = useState("login");
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);
   const [submitting, setSubmitting] = useState(false);
   const [emailStatus, setEmailStatus] = useState(null);
   const [emailChecking, setEmailChecking] = useState(false);

   const isSignup = mode === "signup";

   const runEmailCheck = useCallback(
      async (value) => {
         const normalized = value.trim().toLowerCase();
         if (!normalized || !EMAIL_RE.test(normalized)) {
            setEmailStatus(null);
            return;
         }
         setEmailChecking(true);
         try {
            const data = await checkEmailAvailable(normalized);
            setEmailStatus(data.available ? "available" : "taken");
         } catch {
            setEmailStatus(null);
         } finally {
            setEmailChecking(false);
         }
      },
      [checkEmailAvailable]
   );

   useEffect(() => {
      if (!isSignup) {
         setEmailStatus(null);
         return;
      }
      const t = setTimeout(() => runEmailCheck(email), 500);
      return () => clearTimeout(t);
   }, [email, isSignup, runEmailCheck]);

   useEffect(() => {
      setError(null);
      setEmailStatus(null);
   }, [mode]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_RE.test(normalizedEmail)) {
         setError("Inserisci un indirizzo email valido.");
         return;
      }

      if (isSignup) {
         if (!name.trim()) {
            setError("Inserisci il tuo nome.");
            return;
         }
         if (password.length < 6) {
            setError("La password deve avere almeno 6 caratteri.");
            return;
         }
         if (emailStatus === "taken") {
            setError("Questa email è già registrata. Accedi o usa un'altra email.");
            return;
         }
         if (emailChecking) {
            setError("Attendi la verifica dell'email.");
            return;
         }

         setSubmitting(true);
         try {
            if (emailStatus !== "available") {
               await runEmailCheck(normalizedEmail);
               const data = await checkEmailAvailable(normalizedEmail);
               if (!data.available) {
                  setEmailStatus("taken");
                  setError("Questa email è già registrata. Accedi o usa un'altra email.");
                  setSubmitting(false);
                  return;
               }
            }
            await doRegistration({
               name: name.trim(),
               email: normalizedEmail,
               password,
            });
            setSuccess("Registrazione completata! Ora puoi accedere.");
            setMode("login");
            setPassword("");
            setName("");
         } catch (err) {
            setError(err.message);
         } finally {
            setSubmitting(false);
         }
         return;
      }

      setSubmitting(true);
      try {
         await doLogin(normalizedEmail, password);
         navigate("/app");
      } catch (err) {
         setError(err.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleDemo = async () => {
      setError(null);
      setSubmitting(true);
      try {
         await doLogin("user@demo.com", "demo");
         navigate("/app");
      } catch (err) {
         setError(err.message);
      } finally {
         setSubmitting(false);
      }
   };

   const emailHint = () => {
      if (!isSignup || !email.trim()) return null;
      if (!EMAIL_RE.test(email.trim())) {
         return <span className="login-email-hint taken">Formato email non valido</span>;
      }
      if (emailChecking) {
         return <span className="login-email-hint checking">Verifica disponibilità…</span>;
      }
      if (emailStatus === "available") {
         return <span className="login-email-hint available">Email disponibile</span>;
      }
      if (emailStatus === "taken") {
         return (
            <span className="login-email-hint taken">
               Email già registrata — passa ad Accedi
            </span>
         );
      }
      return null;
   };

   const emailWrapClass =
      isSignup && emailStatus === "taken"
         ? "is-invalid"
         : isSignup && emailStatus === "available"
           ? "is-valid"
           : "";

   return (
      <div className="login-page">
         <div className="login-shell">
            <aside className="login-brand">
               <div className="login-brand-logo">
                  <i className="bi bi-wallet2" aria-hidden />
                  <span>Budget App</span>
               </div>
               <h1>Gestisci le tue finanze</h1>
               <p>
                  Entrate, uscite, budget, wallet e portafoglio in un&apos;unica
                  dashboard moderna e chiara.
               </p>
               <ul className="login-brand-features">
                  <li>
                     <i className="bi bi-check-circle" aria-hidden /> Dashboard e report
                  </li>
                  <li>
                     <i className="bi bi-check-circle" aria-hidden /> Categorie e budget
                  </li>
                  <li>
                     <i className="bi bi-check-circle" aria-hidden /> Portafoglio investimenti
                  </li>
               </ul>
            </aside>

            <div className="login-panel">
               <div className="login-tabs" role="tablist">
                  <button
                     type="button"
                     role="tab"
                     className={`login-tab ${!isSignup ? "active" : ""}`}
                     aria-selected={!isSignup}
                     onClick={() => setMode("login")}
                  >
                     Accedi
                  </button>
                  <button
                     type="button"
                     role="tab"
                     className={`login-tab ${isSignup ? "active" : ""}`}
                     aria-selected={isSignup}
                     onClick={() => setMode("signup")}
                  >
                     Registrati
                  </button>
               </div>

               <h2>{isSignup ? "Crea il tuo account" : "Bentornato"}</h2>
               <p className="login-subtitle">
                  {isSignup
                     ? "Compila i campi per registrarti. Verifichiamo che l'email non sia già in uso."
                     : "Accedi con le tue credenziali per continuare."}
               </p>

               <form className="login-form-fields" onSubmit={handleSubmit} noValidate>
                  {isSignup && (
                     <div className="login-field">
                        <label htmlFor="login-name">Nome</label>
                        <div className="login-input-wrap">
                           <i className="bi bi-person" aria-hidden />
                           <input
                              id="login-name"
                              type="text"
                              name="name"
                              placeholder="Il tuo nome"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              autoComplete="name"
                              required
                           />
                        </div>
                     </div>
                  )}

                  <div className="login-field">
                     <label htmlFor="login-email">Email</label>
                     <div className={`login-input-wrap ${emailWrapClass}`}>
                        <i className="bi bi-envelope" aria-hidden />
                        <input
                           id="login-email"
                           type="email"
                           name="email"
                           placeholder="nome@esempio.it"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           autoComplete="email"
                           required
                        />
                     </div>
                     {emailHint()}
                  </div>

                  <div className="login-field">
                     <label htmlFor="login-password">Password</label>
                     <div className="login-input-wrap">
                        <i className="bi bi-shield-lock" aria-hidden />
                        <input
                           id="login-password"
                           type="password"
                           name="password"
                           placeholder={isSignup ? "Minimo 6 caratteri" : "Password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           autoComplete={isSignup ? "new-password" : "current-password"}
                           minLength={isSignup ? 6 : undefined}
                           required
                        />
                     </div>
                  </div>

                  <div className="login-actions">
                     <button
                        type="submit"
                        className="login-btn-primary"
                        disabled={
                           submitting ||
                           (isSignup && (emailStatus === "taken" || emailChecking))
                        }
                     >
                        {submitting
                           ? "Attendere…"
                           : isSignup
                             ? "Registrati"
                             : "Accedi"}
                     </button>
                     {!isSignup && (
                        <button
                           type="button"
                           className="login-btn-demo"
                           onClick={handleDemo}
                           disabled={submitting}
                        >
                           <i className="bi bi-play-circle me-1" aria-hidden />
                           Prova demo
                        </button>
                     )}
                  </div>
               </form>
            </div>
         </div>

         {error && <ToastMsg variant="danger" message={error} onClose={() => setError(null)} />}
         {success && (
            <ToastMsg variant="success" message={success} onClose={() => setSuccess(null)} />
         )}
      </div>
   );
}

export default Login;
