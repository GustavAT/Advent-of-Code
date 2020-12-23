export class Node {
    public value: number;
    public previous!: Node;
    public next!: Node;

    constructor (value: number) {
        this.value = value;
    }
}
