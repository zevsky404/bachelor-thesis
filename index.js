import * as d3 from "d3";
import {tsv} from "d3";

const treemap = d3.tree().size([500, 500]);
let thread = d3.stratify()([
    {id: "t3_1u26af"},
    {id: "t1_cedrk20", parentId: "t3_1u26af"},
    {id: "t1_cedthyd", parentId: "t1_cedrk20"},
    {id: "t1_cedtudt", parentId: "t1_cedthyd"}
]);

thread = treemap(thread);

const svg = d3.create("svg")
    .attr("viewBox", [0, 0, 500, 500])
const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);


const node = g.selectAll(".node")
    .data(thread.descendants())
    .enter().append("g")
    .attr("class", d => "node" + (d.children ? " node--internal"
        : " node--leaf"))
    .attr("transform", d => "translate(" + d.y + "," +
        d.x + ")");

let main = document.getElementById('main-container');
main.appendChild(svg.node())

