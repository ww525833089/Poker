export default class Utils {

    /**
     * 从对象池中取节点
     * @param nodePool 节点池
     * @param prefab 预制体
     */
    public static getPoolNode(nodePool: cc.NodePool, prefab: cc.Prefab): cc.Node {
        let node: cc.Node = null;
        if (nodePool.size() > 0) {
            node = nodePool.get();
        } else {
            node = cc.instantiate(prefab);
        }
        return node;
    }

    /**
     * 把鱼放回池中
     * @param node 节点
     * @param nodePool 对象池
     */
    public static putPoolNode(node: cc.Node, nodePool: cc.NodePool): void {
        nodePool.put(node);
    }
}
