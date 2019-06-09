class Frog {
    constructor(platforms, range, platform_tree) {
        this.platforms = platforms;
        this.range = range;
        this.platform_tree = platform_tree;
    }

    findRoute() {
        if (this.platforms.length === 0)
            return;

        let start = new Platform(Math.abs(this.platforms[0]), 0, this.platforms, this.range, this.platform_tree);

        let path;
        do {
            path = start.hasGoalBeenReached();
            // console.log(this.platform_tree);
            drawTree(this.platform_tree);
        } while (path === null);

        path.reverse();
        return path;
    }
}