function setZoom() {
    const slider = document.getElementById("container-zoom");
    let container = document.getElementById("main-container");

    container.style.scale = `${slider.value}`;

}

export function getFirstNode(graph) {
    const g = graph.children[0];
    for (let child of g.children) {
        if (child.classList.contains("node") && child.getAttribute("cluster-type") !== "OP") {
            return child.getAttribute("cluster-number");
        }
    }
}

export function getLastNode(graph) {
    const g = graph.children[0];
    return g.lastChild.getAttribute("cluster-number");
}

function displayChoices() {

}


let slider = document.getElementById("container-zoom");
slider.addEventListener("change", setZoom);