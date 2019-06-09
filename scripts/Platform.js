class Platform {
    constructor(depthBuffer, indexInArray, platforms, rangeOfSight, platform_tree, parent) {
        this.depthBuffer = depthBuffer;
        this.indexInArray = indexInArray;
        this.platforms = platforms;
        this.rangeOfSight = rangeOfSight;

        console.log(platform_tree);

        this.children = null;
        this.platform_tree = platform_tree;
        this.node = {
            text: {
                name: this.platforms[this.indexInArray],
            },
        };
        if (parent)
            this.node.parent = parent;

        console.log(this.node);
        this.platform_tree.push(this.node);
    }

    hasGoalBeenReached() {
        this.depthBuffer--;

        if (this.depthBuffer <= 0) {
            if (this.children === null) {
                this.children = [];
                for (let i = this.indexInArray + 1; i < Math.min(this.indexInArray + 1 + this.rangeOfSight, this.platforms.length); i++) {
                    this.children.push(new Platform(Math.abs(Math.abs(this.platforms[this.indexInArray]) - Math.abs(this.platforms[i])), 
                        i, this.platforms, this.rangeOfSight, this.platform_tree, this.node));
                        
                    if (this.children[i - this.indexInArray - 1].isGoal()) {
                        let path = [];
                        path.push(this.children[i - this.indexInArray - 1]);
                        path.push(this);
                        return path;
                    }
                    if (this.children[i - this.indexInArray - 1].depthBuffer == 0) {
                        this.children[i - this.indexInArray - 1].hasGoalBeenReached();
                    }
                }

                return null;
            }

            for (let c of this.children) {
                let tPath = c.hasGoalBeenReached();
                if (tPath !== null) {
                    tPath.push(this);
                    return tPath;
                }
            }
        }

        return null;
    }

    isGoal() {
        return this.indexInArray === this.platforms.length - 1;
    }
}