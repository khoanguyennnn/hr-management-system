export function navigation({ onNavigateEmployees, onNavigateLeaves }) {
    const viewHome = document.getElementById('view-home');
    const viewEmployees = document.getElementById('view-employees');
    const viewLeaves = document.getElementById('view-leaves');

    const btnGoEmployees = document.getElementById('btn-go-employees');
    const btnGoLeaves = document.getElementById('btn-go-leaves');
    const btnNavLeaves = document.getElementById('btn-nav-leaves');
    const btnNavEmployees = document.getElementById('btn-nav-employees');
    const btnNavHomes = document.querySelectorAll('#btn-nav-home');

    function hideAllViews() {
        viewHome.classList.add('hidden');
        viewEmployees.classList.add('hidden');
        viewLeaves.classList.add('hidden');
    }

    function showView(viewId) {
        hideAllViews();
        document.getElementById(viewId).classList.remove('hidden');
    }

    btnGoEmployees.addEventListener('click', () => {
        showView('view-employees');
        onNavigateEmployees();
    });

    btnGoLeaves.addEventListener('click', () => {
        showView('view-leaves');
        onNavigateLeaves();
    });

    btnNavLeaves.addEventListener('click', () => {
        showView('view-leaves');
        onNavigateLeaves();
    });

    btnNavEmployees.addEventListener('click', () => {
        showView('view-employees');
        onNavigateEmployees();
    });

    btnNavHomes.forEach(btn => {
        btn.addEventListener('click', () => {
            showView('view-home');
        });
    });
}
