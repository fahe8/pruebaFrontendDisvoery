/**
 * dashboardGrid.js
 * Manages the draggable and resizable grid layout using GridStack.js
 */

let grid = null;

/**
 * Initializes the dashboard grid
 */
function initDashboardGrid() {
    if (grid) return;

    // Initialize GridStack
    if (typeof GridStack === 'undefined') {
        console.error('GridStack library not loaded. Check CDN URLs in index.html.');
        return;
    }

    grid = GridStack.init({
        cellHeight: 80,
        margin: 10,
        animate: true,
        minRow: 1,
        // Disable float to keep items tightly packed if desired, 
        // but true allows free movement
        float: false, 
        resizable: {
            handles: 'se, sw, ne, nw'
        }
    });

    // Listen for resize events to update Chart.js instances
    grid.on('resizestop', function(event, el) {
        // Find if the resized element contains a canvas
        const canvas = el.querySelector('canvas');
        if (canvas && canvas.id) {
            // Get the chart instance from the global charts object (defined in charts.js)
            const chartId = canvas.id.replace('chart-', '');
            // Some charts might have slightly different keys in the 'charts' object
            // charts.js uses: bar, pie, scatter, solutions, ranking, radar, impactEffort, roiPayback
            
            // Map canvas IDs to chart keys if they differ
            const chartMapping = {
                'bar': 'bar',
                'pie': 'pie',
                'ranking': 'ranking',
                'impact-effort': 'impactEffort',
                'roi-payback': 'roiPayback',
                'scatter': 'scatter',
                'solutions': 'solutions',
                'radar': 'radar'
            };

            const key = chartMapping[chartId];
            if (key && window.charts && window.charts[key]) {
                window.charts[key].resize();
            }
        }
    });
}

// Export to window
window.initDashboardGrid = initDashboardGrid;
