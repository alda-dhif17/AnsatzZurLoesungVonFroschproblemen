using System;
using System.Collections.Generic;

namespace AnsatzZurLösungVonFroschProblemen
{
    public class Platform
    {
        public int indexInArray, deepnessBuffer, rangeOfSight;
        private List<Platform> children;
        private List<int> valueList;

        public Platform(int deepnessBuffer, int indexInArray, List<int> valueList, int rangeOfSight)
        {
            this.deepnessBuffer = deepnessBuffer;
            this.indexInArray = indexInArray;
            this.valueList = valueList;
            this.rangeOfSight = rangeOfSight;
        }

        public List<Platform> hasGoalBeenReached()
        {
            deepnessBuffer--;

            if (deepnessBuffer <= 0)
            {
                if (children == null)
                {
                    children = new List<Platform>();
                    for (int i = indexInArray + 1; i < Math.Min(indexInArray + 1 + rangeOfSight, valueList.Count); i++)
                    {
                        children.Add(new Platform(valueList[i], i, valueList, rangeOfSight));
                        if (children[i - indexInArray - 1].isGoal())
                        {
                            List<Platform> path = new List<Platform>();
                            path.Add(children[i - indexInArray - 1]);
                            path.Add(this);
                            return path;
                        }
                    }
                    return null;
                }

                foreach (Platform p in children)
                {
                    List<Platform> tPath = p.hasGoalBeenReached();
                    if (tPath != null)
                    {
                        tPath.Add(this);
                        return tPath;
                    }
                }
            }

            return null;
        }

        public bool isGoal()
        {
            return indexInArray == valueList.Count - 1;
        }
    }
}
