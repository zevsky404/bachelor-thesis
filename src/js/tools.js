function setZoom() {
    const slider = document.getElementById("container-zoom");
    let container = document.getElementById("main-container");

    container.style.scale = `${slider.value}`;

}

export function getFirstNode(graph) {
    const g = graph.children[0];
    for (let child of g.children) {
        if (child.classList.contains("node") && child.getAttribute("cluster-type") !== "OP") {
            return parseInt(child.getAttribute("cluster-number")) + 1;
        }
    }
}

export function getLastNode(graph) {
    const g = graph.children[0];
    return parseInt(g.lastChild.getAttribute("cluster-number")) + 1;
}

export function displayClusterFirst(clusterNumber, position) {
    let graphs = Array.from(document.querySelector("#main-container").children);
    const graphData = graphs.map(graph => {
        switch (position) {
            case "first": {
                return {
                    element: graph,
                    firstNode: parseInt(getFirstNode(graph))
                }
            }
            case "last": {
                return {
                    element: graph,
                    firstNode: parseInt(getLastNode(graph))
                }
            }
        }
    });

    graphData.sort((a,b) => {
        // Priority to graphs with the selected first node
        if (a.firstNode === clusterNumber && b.firstNode !== clusterNumber) {
            return -1; // a comes first
        } else if (a.firstNode !== clusterNumber && b.firstNode === clusterNumber) {
            return 1; // b comes first
        } else {
            return a.firstNode - b.firstNode; // Normal ascending order for other cases
        }
    });

    let testContainer = document.createElement("div");
    testContainer.id = "test-sorting";
    testContainer.style.border = "1px solid red";

    graphData.forEach(item => {
        document.getElementById("main-container").appendChild(item.element)
    });

}