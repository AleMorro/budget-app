import React from "react";
import PageTitle from "../PageTitle";
import Footer from "../../Footer";
import "../../styles/Main.css";

const FEATURES = [
   {
      title: "Home e dashboard",
      text: "Panoramica entrate/uscite con filtro anno/mese, grafici, card KPI e confronto con il periodo precedente.",
   },
   {
      title: "Wallets",
      text: "Conti multipli (anche seed demo), saldo stimato e assegnazione wallet alle singole operazioni.",
   },
   {
      title: "Budget",
      text: "Tetti mensili per categoria di spesa, barre di utilizzo e avvisi di superamento.",
   },
   {
      title: "Incomes & Expenses",
      text: "CRUD movimenti, filtri temporali, grafici per categoria allineati al periodo selezionato.",
   },
   {
      title: "Previous Years",
      text: "Analisi storica su anni passati.",
   },
   {
      title: "Portafoglio",
      text: "Titoli multi-broker, PMC, P/L, grafici con intervalli temporali e aggiornamento quotazioni.",
   },
   {
      title: "Impostazioni",
      text: "Tema scuro/chiaro, icone e colori categorie, profilo e nome visualizzato.",
   },
];

const FAQ = [
   {
      q: "I dati finanziari sono sul server?",
      a: "Entrate e uscite sono nel database SQLite del backend. Wallet, budget, categorie visive, portafoglio titoli e preferenze profilo sono in localStorage del browser.",
   },
   {
      q: "Come aggiungo un titolo in portafoglio?",
      a: "Vai su Portafoglio, compila simbolo (es. ENI.MI), broker, data, prezzo e quantità, poi Registra acquisto.",
   },
   {
      q: "Il grafico del titolo non si aggiorna?",
      a: "Le quotazioni si aggiornano ogni 5 minuti. Verifica che il backend sia avviato su localhost:5000.",
   },
   {
      q: "Posso usare l'app senza registrarmi?",
      a: "Serve un account. Puoi usare Prova demo dalla schermata di login se configurato.",
   },
   {
      q: "Come cambio il tema?",
      a: "Impostazioni → Tema, oppure voce Tema nel menu Settings della sidebar.",
   },
];

function HelpPage() {
   return (
      <main id="main" className="main">
         <PageTitle page="Guida e FAQ" />

         <section className="dashboard section">
            <div className="row">
               <div className="col-lg-10 mx-auto">
                  <div className="card mb-4">
                     <div className="card-body">
                        <h5 className="card-title">Cosa puoi fare con Budget App</h5>
                        <p className="text-muted small">
                           Applicazione per tracciare finanze personali, budget e investimenti in un&apos;unica
                           interfaccia.
                        </p>
                        <div className="row g-3">
                           {FEATURES.map((f) => (
                              <div key={f.title} className="col-md-6">
                                 <div className="border rounded p-3 h-100">
                                    <h6 className="text-primary mb-2">{f.title}</h6>
                                    <p className="small text-muted mb-0">{f.text}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="card">
                     <div className="card-body">
                        <h5 className="card-title">Domande frequenti</h5>
                        <div className="accordion" id="faqAccordion">
                           {FAQ.map((item, i) => (
                              <div className="accordion-item" key={item.q}>
                                 <h2 className="accordion-header">
                                    <button
                                       className="accordion-button collapsed"
                                       type="button"
                                       data-bs-toggle="collapse"
                                       data-bs-target={`#faq-${i}`}
                                    >
                                       {item.q}
                                    </button>
                                 </h2>
                                 <div
                                    id={`faq-${i}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#faqAccordion"
                                 >
                                    <div className="accordion-body small text-muted">{item.a}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}

export default HelpPage;
