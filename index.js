import * as d3 from "d3";

let getData = d3.json("./data/process_2023-11-16_17:31.json").then((response) => {
    return response;
});

getData.then((data) => {
    const margin = {top: 10, left: 5, bottom: 10, right: 5};
    let diagonal = function diagonal(d, marginL, marginB) {
        return "M" + d.source.x + "," + d.source.y
            + " C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
            + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y
            + " " + d.target.x + "," + d.target.y;
    };

    const width = 100 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

// colour constants
    const colorOp = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(d3.extent([0,9]))
    const colorComments = d3.scaleOrdinal()
        .range(["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"])
        .domain(d3.extent([0,5]));

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
            .attr("font-size", 10);


        const node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", d => "node" + (d.children ? " node-internal"
                : " node-leaf"))
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

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

        let main = document.getElementById('main-container');
        main.appendChild(svg.node())
    }

    for (let thread of data) {
        buildTreeForThread(thread)
    }
})




