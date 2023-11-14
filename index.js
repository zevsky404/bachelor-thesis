import * as d3 from "d3";

/*const data = [
    {id: "t3_1u26af"},
    {id: "t1_cedrk20", parent_id: "t3_1u26af"},
    {id: "t1_cedthyd", parent_id: "t1_cedrk20"},
    {id: "t1_cedtudt", parent_id: "t1_cedrk20"}
];*/

const data = [{"id": "t3_11z1qpg"}, {"id": "t1_jdah58q", "parent_id": "t3_11z1qpg"}, {"id": "t1_jdai9xf", "parent_id": "t1_jdah58q"}, {"id": "t1_jdatppq", "parent_id": "t1_jdatdlp"}, {"id": "t1_jdais0f", "parent_id": "t1_jdai9xf"}, {"id": "t1_jdatdlp", "parent_id": "t1_jdastor"}, {"id": "t1_jdak4vp", "parent_id": "t1_jdais0f"}, {"id": "t1_jdaoj9b", "parent_id": "t1_jdak4vp"}, {"id": "t1_jdari8s", "parent_id": "t1_jdaoj9b"}, {"id": "t1_jdastor", "parent_id": "t1_jdari8s"}]

let diagonal = function diagonal(d) {
    return "M" + d.source.x + "," + d.source.y
        + " C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
        + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y
        + " " + d.target.x + "," + d.target.y;
};

const tree = d3.tree().size([300, 300]);
let root = d3.stratify()
    .id(d => d.id)
    .parentId(d => d.parent_id)
    (data);

root = tree(root);

const links = root.links();

console.log(root)
console.log(links)

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

const edge = g.selectAll(".edge")
    .data(links)
    .enter().append("path")
    .attr("class", "edge")
    .style("stroke", "black")
    .style("fill", "none")
    .attr("d", diagonal);

node.append("circle")
    .attr("r", "2")
    .style("stroke", "black")
    .style("fill", "none");

let main = document.getElementById('main-container');
main.appendChild(svg.node())

