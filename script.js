let si = 0;
let sj = 0;
let gi = 0;
let gj = 5;

let optimalPath = "";

let edgeWeights = [
    '','','','0','','1','','0','','C','','','','',
    '','','1','C','C','1','1','0','0','1','1','1','1','',
    '','','0','0','0','0','0','0','0','C','C','0','0','',
    '','','1','1','1','C','C','1','1','0','0','0','0','',
    '','','0','0','0','0','0','0','0','C','C','1','1','',
    '','','1','1','1','1','1','0','0','0','0','0','0','',
    '','','','','','','','','','','','','','',
];

let nodeValues = [
    'S','0','1','0','C','G',
    '1','C','1','0','1','1',
    '0','0','0','0','C','0',
    '1','1','C','1','0','0',
    '0','0','0','0','C','1',
    '1','1','1','0','0','0',
]

let screenCards = [];
let screenCardsCount = 0;

let movedCards = [];
let movedCardsCount = 0;
let tempCards = [];

let cardIndex = 0;

let edgeCount = 0;

let cardHeightOffset = 0;

function createGrid(){
    let cols = 6;
    let rows = 6;
    let gridContainer = document.getElementById('grid-container');

    for(let i=0;i<rows;i++){
        let row = document.createElement('div');
        row.classList.add('grid-row');
        for(let j=0;j<cols;j++){
            let cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.id = `cell-${cols*i + j}`;
            
            cell.setAttribute('node-value', nodeValues[cols*i + j]);
            cell.innerText = `${cols*i + j}`;
            if(cell.getAttribute('node-value') == '1'){
                cell.style.backgroundColor = 'black';
            } else if(cell.getAttribute('node-value') == 'C'){
                cell.style.backgroundColor = 'red';
            }
            row.appendChild(cell);
        }
        gridContainer.appendChild(row);
    }
    ////console.log(gridContainer);
}

function createSquares(){
    let cols = 7;
    let rows = 7;
    let gridContainer = document.getElementById('square-container');

    for(let i=0;i<rows;i++){
        let row = document.createElement('tr');
        row.classList.add('grid-row');
        for(let j=0;j<cols;j++){
            let cell = document.createElement('td');
            cell.classList.add('grid-square');
            let div1 = document.createElement('div');
            let div2 = document.createElement('div');
            let div3 = document.createElement('div');
            let div4 = document.createElement('div');
            div1.classList.add('left');
            div2.classList.add('top');
            div3.classList.add('bottom');
            div4.classList.add('right');
            div1.innerText = `${edgeWeights[edgeCount++]}`;
            div2.innerText = ``;
            div3.innerText = `${edgeWeights[edgeCount++]}`;
            div4.innerText = ``;
            cell.appendChild(div1);
            cell.appendChild(div2);
            cell.appendChild(div3);
            cell.appendChild(div4);
            // if(i == 0 || i == rows-1 || j == 0 || j == cols-1){
            //     cell.classList.add('no-border');
            // }
            row.appendChild(cell);
        }
        gridContainer.appendChild(row);
    }
    ////console.log(gridContainer);
}

createGrid();
createSquares();


// A* algorithm implementation
let rows = 6;
let cols = 6;
let openList = [];

const f = new Map();
const g = new Map();
const visited = new Map();
const par = new Map();
let minPathCost = 0;
let isGoalFound = false;

let nodes = document.querySelectorAll('.grid-cell');
//console.log(nodes[15].innerText);
// openList.push([5,'A']);
// openList.push([0,'B']);
// openList.push([1,'C']);

openList.sort((a, b) => a[0] - b[0]);

// let [f_value,node] = openList.shift();
// //console.log(`Node with lowest f-value: ${node} with f-value: ${f_value}`);
// [f_value,node] = openList.shift();
// //console.log(`Node with lowest f-value: ${node} with f-value: ${f_value}`);
// [f_value,node] = openList.shift();
// //console.log(`Node with lowest f-value: ${node} with f-value: ${f_value}`);
function loc(i,j){
    return cols*i + j;
}

function h(i,j,gi,gj){
    return Math.abs(i - gi) + Math.abs(j - gj);
}

function get_g(i,j){
    let cost = 1;
    if(nodeValues[loc(i,j)] == 'C'){
        cost = 3; // Cost for crossing a 'C' node
    } else if(nodeValues[loc(i,j)] == 'S' || nodeValues[loc(i,j)] == 'G'){
    cost = 0; // Start and Goal nodes have no cost
    }
    const parent = par.get(loc(i, j));
    return parent !== undefined ? cost + g.get(parent) : cost;
    
}

function get_f(i,j,gi,gj){
    g.set(loc(i,j), get_g(i,j)); // Ensure g is updated correctly
    const hValue = h(i,j,gi,gj); // Calculate h value
    return g.get(loc(i,j)) + hValue; // Explicitly sum g and h
}

function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printPath(si,sj,gi,gj){
    let nodes = [];
    let node = loc(gi, gj);
    nodes.push(node);
    while(node !== -1){
        nodes.push(node);
        document.getElementById(`cell-${node}`).style.backgroundColor = 'yellow'; // Highlight the path
        document.getElementById(`cell-${node}`).style.color = 'black'; // Highlight the path
       
        node = par.get(node);
        await wait(500);
    }

    while(nodes.length > 0){
        
            let id = nodes.pop();
            optimalPath += `${id}`;
        if(nodes.length !== 0)optimalPath += ' -> ';
        let i = Math.floor(id / cols);
        let j = id % cols;
        let cell = document.getElementById(`cell-${id}`);
        
        //console.log(`Path node: (${i}, ${j})`);    
        
        
    }


}

function sortCards(){
    let diffs = [];
    let nodeValues = screenCards.map(card => card[0]);
    let f_values = screenCards.map(card => card[1]);

    let nodeMap = new Map();
    for(let i=0;i<nodeValues.length;i++){
        nodeMap.set(i, nodeValues[i]);
    }
    //console.log(arr);

    let indices = f_values.map((_,i) => i);
    //console.log(indices);
    indices.sort((a, b) => f_values[a] - f_values[b]);
    //console.log(indices);
    let sortedIndices = new Map();
    for(let i=0;i<indices.length;i++){
        sortedIndices.set(indices[i],i);
    }
    //console.log(sortedIndices);
    for(let i=0;i<indices.length;i++){
        diffs.push(sortedIndices.get(i) - i);
    }
    //console.log(diffs);

    document.getElementById('screen').innerHTML = ''; // Clear the screen

    // f_values.sort((a, b) => a - b); // Sort f-values
    for(let i=0;i<indices.length;i++){
        let nodeNumber = parseInt(nodeMap.get(i));
        let card = document.createElement('div');
        card.classList.add('card');
        card.id = `card-${nodeNumber}`;
        card.setAttribute('f_value', f.get(nodeNumber));
        let nodeIcon = document.createElement('div');
        nodeIcon.classList.add('node-icon');
        nodeIcon.innerHTML = `<div class="grid-cell">${nodeNumber}</div>`;
        let nodeValue = document.createElement('div');
        nodeValue.classList.add('f-value');
        nodeValue.innerHTML = `F(${nodeNumber}): ${f.get(nodeNumber)}<br>G(${nodeNumber}): ${g.get(nodeNumber)}<br>H(${nodeNumber}): ${h(Math.floor(parseInt(nodeNumber)/cols), nodeNumber%cols, gi, gj)}`;
        card.appendChild(nodeIcon);
        card.appendChild(nodeValue);
        document.getElementById('screen').appendChild(card);
    }
    // while(tempCards.length > 0){
    //     screenCards.push(tempCards.pop());
    // }
}

function moveCards(){
    let topCard = screenCards.shift()[0];
    movedCardsCount++;
    console.log(`Moving card: ${topCard}`);
    
    for(let i=0;i<movedCards.length;i++){
        // let card = document.getElementById(`card-${movedCards[i]}`);
        // console.log("Moving cards down: ", card.id);
        // card.style.transform = `translateY(${50}px)`;
    }
    movedCards.unshift(topCard);
    document.getElementById(`card-${topCard}`).style.transform = `translateX(-${230}px)`;
    document.getElementById(`card-${topCard}`).children[1].classList.add('animate');
    // document.getElementById(`card-${topCard}`).style.transition = "transform 0.5s ease-in-out";
    // document.getElementById(`card-${topCard}`).children[1].style.backgroundColor = 'lightgreen'; // Mark as processed

    let topCardDiv = document.getElementById(`card-${topCard}`);
    
        topCardDiv.style.transition = "";
        topCardDiv.style.transform = "";
        document.getElementById('visited-nodes').prepend(topCardDiv);   
    
}

async function A_star(si,sj,gi,gj){
    await wait(1300);
    par.set(loc(si,sj), -1);
    g.set(loc(si,sj), 0);
    f.set(loc(si,sj), h(si, sj, gi, gj)); // Initial f-value is just the heuristic
    console.log(g.get(loc(si,sj)), f.get(loc(si,sj)));
    openList.push([f.get(loc(si,sj)), loc(si,sj)]);

    while(openList.length !== 0){
        console.log("front node: ", openList[0])
        let id = openList.shift()[1];
        let i = Math.floor(id / cols);
        let j = id % cols;
        if(visited.has(id)){
            continue;
        }
        document.getElementById(`cell-${id}`).style.backgroundColor = 'blue'; // Mark as open
        
        visited.set(id, true);
        
        // Check all 4 directions
        let directions = [
            [0, 1], // Right
            [1, 0], // Down
            [0, -1], // Left
            [-1, 0] // Up
        ];
        for(let [di, dj] of directions){
            let ni = i + di;
            let nj = j + dj;
            if(ni < 0 || ni >= rows || nj < 0 || nj >= cols){
                continue; // Out of bounds
            }
            //console.log(typeof(ni),ni);
            let n_id = loc(ni, nj);
            //console.log(n_id);
            if(nodeValues[n_id] === '1'){
                document.getElementById(`cell-${n_id}`).style.transform = `translateX(-2px)` // Mark as blocked
                setTimeout(() => {
                    document.getElementById(`cell-${n_id}`).style.transform = `translateX(2px)` // Mark as blocked
                }, 300);
                setTimeout(() => {
                    document.getElementById(`cell-${n_id}`).style.transform = `translateX(0px)` // Mark as blocked
                }, 600);
                continue; // Cannot traverse through '1'
            }
            let weight = 1;
            if(nodeValues[n_id] === 'C'){
                weight = 3; // Cost for crossing a 'C' node
            }
            let cost = get_g(n_id/cols,n_id%cols);
            if(!visited.has(n_id) || cost < g.get(n_id)){
                g.set(n_id, cost);
                f.set(n_id, get_f(ni, nj, gi, gj));
                par.set(n_id, id);
                //console.log(`cell-${n_id}`);
                document.getElementById(`cell-${n_id}`).style.backgroundColor = 'darkorange'; // Mark as open

                // initialize card

                let card = document.createElement('div');
                card.classList.add('card');
                card.id = `card-${n_id}`;
                card.setAttribute('f_value', f.get(n_id));
                let nodeIcon = document.createElement('div');
                nodeIcon.classList.add('node-icon');
                nodeIcon.innerHTML = `<div class="grid-cell">${n_id}</div>`;
                let nodeValue = document.createElement('div');
                nodeValue.classList.add('f-value');
                nodeValue.innerHTML = `F(${n_id}): ${f.get(n_id)}<br>G(${n_id}): ${g.get(n_id)}<br>H(${n_id}): ${h(ni, nj, gi, gj)}`;
                card.appendChild(nodeIcon);
                card.appendChild(nodeValue);

                if(!screenCards.some(card => card[0] === n_id)){
                    screenCards.push([n_id, f.get(n_id)]);
                    setTimeout(() => {
                        document.getElementById('screen').appendChild(card);
                        tempCards.push(parseInt(card.id.split('-')[1])); // Store card index and id
                        sortCards();
                        if(screenCards.length > 1){
                            document.getElementById(`card-${id}`).children[1].style.backgroundColor="blue";
                            document.getElementById(`card-${id}`).children[1].style.color="white";
                        }
                    }, 100);
                    
                    
                    
                    
                    openList.push([f.get(n_id), n_id]);
                    openList.sort((a, b) => a[0] - b[0]); // Sort open list by f-value
                    
                }

            }
            if(i == gi && j == gj){
                isGoalFound = true;
                document.getElementById(`cell-${id}`).style.backgroundColor = 'green'; // Mark as goal
                minPathCost = g.get(id);
                
                //console.log(`Goal found at (${gi}, ${gj}) with cost: ${minPathCost}`);
                break;
            }
            await wait(1300);
        }
        if(visited.has(id)){
            document.getElementById(`cell-${id}`).style.backgroundColor = 'green'; // Mark as visited
            if(id!== loc(si,sj))
            moveCards();
        }
        screenCards.sort((a, b) => a[1] - b[1]); // Sort screen cards by f-value
        await wait(2300);
    }
}


function showSummary(){}

async function visualize_A_star(){
    await A_star(0, 0, 0, 5);
    await printPath(0, 0, 0, 5);
    await showSummary();
}

visualize_A_star();
document.getElementById('summary').style.color = 'black';
document.getElementById('total-cost').innerText = `${minPathCost}`;
document.getElementById('path').innerText = `${optimalPath}`;



document.querySelectorAll('.container').forEach(container => {
    container.style.left = `${window.innerWidth/2 - container.getBoundingClientRect().width/2}px`;    
    container.style.top = `${window.innerHeight/2 - container.getBoundingClientRect().height/2}px`;    
});

document.getElementById('legend').style.top = `${window.innerHeight/2 - document.getElementById('legend').getBoundingClientRect().height/2}px`;

// document.getElementById('offset-square').style.left = `${window.innerWidth/2 - document.getElementById('offset-square').getBoundingClientRect().width/2}px`;
// document.getElementById('offset-square').style.top = `${window.innerHeight/2 - document.getElementById('offset-square').getBoundingClientRect().height/2}px`;

// document.getElementById('grid-square').style.left = `${window.innerWidth/2 - document.getElementById('offset-square').getBoundingClientRect().width/2}px`;
// document.getElementById('offset-square').style.top = `${window.innerHeight/2 - document.getElementById('offset-square').getBoundingClientRect().height/2}px`;

window.addEventListener('resize', () => {
    document.querySelectorAll('.container').forEach(container => {
        container.style.left = `${window.innerWidth/2 - container.getBoundingClientRect().width/2}px`;    
        container.style.top = `${window.innerHeight/2 - container.getBoundingClientRect().height/2}px`;    
        
    });
    document.getElementById('legend').style.top = `${window.innerHeight/2 - document.getElementById('legend').getBoundingClientRect().height/2}px`;
});
