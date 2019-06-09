var canvas = document.getElementById('main-canvas'),
    ctx = canvas.getContext('2d');

function drawPlatforms(platforms, routeIndices=[]) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    let pw = canvas.clientWidth / platforms.length;
    let max = Math.max(...platforms);

    let bh = canvas.clientHeight/2;

    
    for (let i = 0; i < platforms.length; i++) {
        color = routeIndices.includes(i) ? 'rgba(255,0,0,.5)' : '#f2f2f2';

        if (bh * (1/(max/platforms[i])) === 0) {
            ctx.beginPath();

            ctx.moveTo(pw*i, bh - bh * (1/(max/platforms[i])));
            ctx.lineTo(pw*i+pw-5, bh - bh * (1/(max/platforms[i])));
            
            ctx.strokeStyle = color;
            ctx.lineWeight = 2;
            ctx.stroke();
        } else {
            ctx.beginPath();

            ctx.rect(pw*i, bh - bh * (1/(max/platforms[i])), 
            pw-5, bh * (1/(max/platforms[i])));

            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    let frog = new Image(pw-5, pw-5);
    frog.onload = function () {
        ctx.drawImage(frog, 0, bh - bh * (1/(max/platforms[0])) - (pw+5), this.width, this.height);
    };
    frog.src = 'media/frog.jpg';

}

function leadsToGoal(node, route) {
    if (node.children === undefined || node.children === null) {
        return node.isGoal();
    }

    for (let c of node.children) {
        if (route.includes(c.indexInArray))
            return leadsToGoal(c, route);
    }
    return false;
}

function buildTree(platforms, route, node, parent=undefined) {
    let arr = [{
        text: {
            // name: 'Index: ' + node.indexInArray,
            // title: 'Value: ' + platforms[node.indexInArray],
        },
    },];
    
    if (parent)
        arr[0].parent = parent;

    if (node.isGoal())
        arr[0].innerHTML = `<span style="color: #faa; font-size: 2.5em;">${platforms[node.indexInArray]}</span>`;
    else if (route.includes(node.indexInArray) && leadsToGoal(node, route))
        arr[0].innerHTML = `<span style="color: #111; font-size: 2.5em;">${platforms[node.indexInArray]}</span>`;
    else
        arr[0].text.name = platforms[node.indexInArray];

    if (node.children !== undefined && node.children !== null) {
        for (let c of node.children) {
            arr.push(...buildTree(platforms, route, c, arr[0]));
        }
    }

    return arr;
}

function drawTree(tree) {
    document.getElementById('tree-head').style.display = 'block';

    tree = [
        {
            container: '#tree-out',
            levelSeperation: 10,
            siblingSeperation: 15,
            subTreeSeperation: 7.5,
            rootOrientation: 'WEST',

            node: {
                HTMLclass: 'frog-node',
                // drawLineThrough: true,
            },
            connectors: {
                type: 'step',
                style: {
                    'stroke-width': 2,
                    'stroke': '#C1FFDE',
                },
            },
        },
        ...tree,
    ];

    let chart = new Treant(tree);
}

window.onload = () => {
    document.getElementById('in-form').onsubmit = function (e) {
        e.preventDefault();

        let platforms_in = document.getElementById('pls_in').value,
            range = document.getElementById('ran_in').value;

        if (platforms_in === null || range <= 0 || isNaN(+range)) {
            window.alert('Please enter legal values!');
            return;
        }

        range = +range;

        let platforms = [];

        platforms_in = platforms_in.replace(/,/g, ' ');
        platforms_in = platforms_in.replace(/  /g, ' ');

        console.log(platforms_in);

        platforms_in.split(' ').forEach(p => {
            if (isNaN(+p) || !isFinite(+p)) {
                window.alert('Please enter only numbers / legal values!');
                return;
            }
            platforms.push(+p);
        });

        drawPlatforms(platforms);

        let ptree = [];

        let frog = new Frog(platforms, range, ptree);

        let stime = new Date().getTime();
        let route = frog.findRoute();

        console.log(`The route calculation took ... ~ ${new Date().getTime() - stime}ms ... `);

        let story = 'Our little frog wanted to go on an adventure. However, since he wasn\'t the strongest of all the frogs in the land, he decided to jump as little as possible. Considering the height of the hills he was facing he decided that he could jump over a maximum of ' + range + ' of them. Using this range, he wanted to find the path that contained the least high hills. Since he was quite clever, he quickly discovered that in this case he would have to take the mountains ' + route.map(v => v.indexInArray).join(', ') + ' in order to achieve this.';
        let speech = new SpeechSynthesisUtterance(story);
        window.speechSynthesis.speak(speech);

        drawPlatforms(platforms, route.map(v => v.indexInArray));
        drawTree(buildTree(platforms, route.map(v => v.indexInArray), route[0]));
    };
};