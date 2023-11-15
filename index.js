import * as d3 from "d3";

const data = [{"id": "t3_11z1qpg", "cluster_type": "OP", "cluster": 0}, {"id": "t1_jdah58q", "parent_id": "t3_11z1qpg", "cluster_type": "C", "cluster": 1}, {"id": "t1_jdai9xf", "parent_id": "t1_jdah58q", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdatppq", "parent_id": "t1_jdatdlp", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdais0f", "parent_id": "t1_jdai9xf", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdatdlp", "parent_id": "t1_jdastor", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdak4vp", "parent_id": "t1_jdais0f", "cluster_type": "C", "cluster": 3}, {"id": "t1_jdaoj9b", "parent_id": "t1_jdak4vp", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdari8s", "parent_id": "t1_jdaoj9b", "cluster_type": "C", "cluster": 0}, {"id": "t1_jdastor", "parent_id": "t1_jdari8s", "cluster_type": "C", "cluster": 1}]

const margin = {top: 50, left: 20, bottom: 50, right: 20};
let diagonal = function diagonal(d) {
    return "M" + d.source.x + "," + d.source.y
        + " C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
        + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y
        + " " + d.target.x + "," + d.target.y;
};

const width = 500 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const tree = d3.tree().size([width, height]);
let root = d3.stratify()
    .id(d => d.id)
    .parentId(d => d.parent_id)
    (data);

root = tree(root);
console.log(root.descendants())
const links = root.links();

const colorOp = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(d3.extent([0,9]))

const colorComments = d3.scaleOrdinal()
    .range(["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"])
    .domain(d3.extent([0,5]));

const svg = d3.create("svg")
    .attr("viewBox", [0, 0, 500, 500])
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
    .attr("r", "4")
    .style("stroke", "black")
    .style("fill", d => { return d.data.cluster_type === "OP" ? colorOp(d.data.cluster) : colorComments(d.data.cluster) });

const edge = g.selectAll(".edge")
    .data(links)
    .enter().append("path")
    .attr("class", "edge")
    .style("stroke", "black")
    .style("fill", "none")
    .attr("d", diagonal);

let main = document.getElementById('main-container');
main.appendChild(svg.node())

