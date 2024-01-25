//IRSA.js

function calculerIRSA(BASE, ENFANT) {
  const plafond1 = 350000;
  const plafond2 = 400000;
  const plafond3 = 500000;
  const plafond4 = 600000;

  const taux1 = 0.05;
  const taux2 = 0.1;
  const taux3 = 0.15;
  const taux4 = 0.2;

  const deductionEnfant = 2000;

  const montant1 = Math.min(Math.max(0, BASE - plafond1), 50000) * taux1;
  const montant2 = Math.min(Math.max(0, BASE - plafond2), 100000) * taux2;
  const montant3 = Math.min(Math.max(0, BASE - plafond3), 100000) * taux3;
  const montant4 = Math.max(0, BASE - plafond4) * taux4;

  const irsaAvantDeduction = 3000 + montant1 + montant2 + montant3 + montant4;

  const irsaApresDeduction = irsaAvantDeduction - deductionEnfant * ENFANT;

  return Math.max(0, irsaApresDeduction); // L'IRSA ne peut pas être négatif
}

// Exemple d'utilisation
const BASE = 30000000; // À remplacer par la valeur réelle
const ENFANT = 0; // À remplacer par le nombre réel d'enfants

const irsa = calculerIRSA(BASE, ENFANT);
console.log("L'IRSA est :", irsa);
