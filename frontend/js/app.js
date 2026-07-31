import { navigation } from './navigation.js';
import { employees } from './employees.js';
import { leaves } from './leaves.js';

document.addEventListener('DOMContentLoaded', () => {
    const { loadEmployees } = employees();
    const { loadLeaves } = leaves(loadEmployees);

    navigation({
        onNavigateEmployees: loadEmployees,
        onNavigateLeaves: loadLeaves
    });
});
