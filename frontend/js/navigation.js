import { employees } from './employees.js';
import { leaves } from './leaves.js';

export function navigation() {
    const appRoot = document.getElementById('app-root');

    async function loadView(viewName) {
        const response = await fetch(`views/${viewName}.html`);
        const html = await response.text();
        appRoot.innerHTML = html;
    }

    async function showHome() {
        await loadView('home');
        
        const btnGoEmployees = document.getElementById('btn-go-employees');
        const btnGoLeaves = document.getElementById('btn-go-leaves');

        btnGoEmployees.addEventListener('click', showEmployees);
        btnGoLeaves.addEventListener('click', showLeaves);
    }

    async function showEmployees() {
        await loadView('employees');
        
        const { loadEmployees } = employees();
        
        const btnNavLeaves = document.getElementById('btn-nav-leaves');
        const btnNavHomes = document.querySelectorAll('#btn-nav-home');
        
        btnNavLeaves.addEventListener('click', showLeaves);
        btnNavHomes.forEach(btn => btn.addEventListener('click', showHome));

        loadEmployees();
    }

    async function showLeaves() {
        await loadView('leaves');
        
        const { loadLeaves } = leaves();
        
        const btnNavEmployees = document.getElementById('btn-nav-employees');
        const btnNavHomes = document.querySelectorAll('#btn-nav-home');
        
        btnNavEmployees.addEventListener('click', showEmployees);
        btnNavHomes.forEach(btn => btn.addEventListener('click', showHome));

        loadLeaves();
    }

    // Start with home
    showHome();
}
