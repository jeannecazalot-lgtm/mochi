// Écran « Jour X ensemble » v3 (Jeanne, 14 nov 2026 : « qu'on voie que c'est une application, pas un PowerPoint ») :
// Mochi quitte sa vraie place sur l'Accueil pour venir au centre, puis y retourne. L'Accueil donne la boîte de son
// Mochi (coordonnées écran) et cache le sien pendant le vol.
import { useEffect, useState } from 'react';

let box = null;
export const setMochiBox = b => { box = b; };
export const getMochiBox = () => box;

let away = false;
const subs = new Set();
export const setMochiAway = v => { away = v; subs.forEach(f => f(v)); };
export function useMochiAway() {
  const [a, setA] = useState(away);
  useEffect(() => { subs.add(setA); return () => { subs.delete(setA); }; }, []);
  return a;
}
