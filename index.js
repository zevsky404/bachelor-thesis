import * as d3 from "d3";

let getData = d3.json("./data/process_2023-12-05_16:22.json").then((response) => {
    return response;
});

// COLOUR CONSTANTS
const colorOp = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(d3.extent([0,9]));

const colorComments = d3.scaleOrdinal()
    .range(["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"])
    .domain(d3.extent([0,5]));

const colorPreds = d3.scaleOrdinal(d3.schemeDark2)
    .domain(["V", "T", "R", "P", "F"]);

// HELPER FUNCTIONS
function reducePreds(predsList) {
    let predsString = "";
    for (let aduType of predsList) {
        predsString += aduType.entity[0];
    }

    return predsString
}

// ENTRY
getData.then((data) => {
    // DRAWING SETUP
    const margin = {top: 10, left: 5, bottom: 10, right: 5};
    let diagonal = function diagonal(d) {
        return "M" + d.source.x + "," + d.source.y
            + " C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
            + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y
            + " " + d.target.x + "," + d.target.y;
    };

    const width = 100 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    function buildTreeForThread(thread) {
        // hierarchy setup for root and links
        const tree = d3.tree().size([width, height]);
        let root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.parent_id)
            (thread);
        root = tree(root);
        const links = root.links();

        const svg = d3.create("svg")
            .attr("width", 100)
            .attr("height", "100")
            .style("display", "inline-block")

        const g = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 5);


        const node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
                .attr("class", d => "node" + (d.children ? " node-internal "
                    : " node-leaf ") + d.id)
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .attr("adu-types", d => reducePreds(d.data.preds))
                .on("click", nodeMouseover);


        node.append("circle")
            .attr("r", "2")
            .style("stroke", "black")
            .style("stroke-width", "0.5")
            .style("fill", d => { return d.data.cluster_type === "OP" ? colorOp(d.data.cluster) : colorComments(d.data.cluster) });

        const edge = g.selectAll(".edge")
            .data(links)
            .enter().append("path")
            .attr("class", "edge")
            .style("stroke", "black")
            .style("stroke-width", "0.5")
            .style("fill", "none")
            .attr("d", diagonal);

        node.raise();


        let main = document.getElementById('main-container');
        main.appendChild(svg.node())
    }

    let arguLineHover = d3.select("#main-container")
        .append("div")
        .style("display", "none")
        .attr("class", "arguline-hover")
        .style("background-color", "white")
        .style("opacity", 1)
        .style("border", "solid")
        .style("border-width", "0.5px")
        .style("border-radius", "1px")
        .style("padding", "5px");

    const nodeMouseover = function(hoverEvent) {
        console.log(this)
        if (arguLineHover.style("display") === "none") {
            arguLineHover.style("display", "block");
        } else if (arguLineHover.style("display") === "block") {
            arguLineHover.style("display", "none");
        }

        arguLineHover.style("left", hoverEvent.x + 5 + "px")
            .style("top", hoverEvent.y + 5 + "px")
            .style("position", "absolute")
            .style("font-size", "5px")
            .html(this.getAttribute("adu-types"));
    }


    let successCounter = 0;
    let errorCounter = 0;
    for (let thread of data) {
        try {
            buildTreeForThread(thread);
            ++successCounter;
        } catch (error) {
            console.error(error);
            ++errorCounter;
            continue;
        }
    }
    console.log(`Amount of successfully drawn trees: ${successCounter}`)
    console.log(`Amount of unsuccessfully drawn trees: ${errorCounter}`)
})




