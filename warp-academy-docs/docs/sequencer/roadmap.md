# Roadmap

The implementation plan for decentralizing the Warp sequencer involves a gradual transition from a centralized architecture to a distributed system. 
This plan encompasses several key steps, including adopting a BFT consensus engine, decentralizing the relayer, implementing transaction encryption, introducing order mechanisms, and opening up to external participants.

1. The initial step involves replacing the current centralized sequencer with a new decentralized network of sequencers.
The transition from one solution to another should occur as seamlessly as possible for users, ensuring data continuity.
A [Warp SDK](/docs/sdk/overview) version supporting this process will be released. 
Once all clients have switched to the new SDK version, the old sequencer will be shut down and the new one will be activated shortly thereafter.
After this step, the sequencer will operate in a decentralized manner, except for the relayer component.

2. The second step involves decentralizing the [relayer](/docs/sequencer/lifecycle/relaying) component. 
Sequencer nodes gradually assume the relayer's role in transmitting data from the sequencer to Arweave.
This decentralization redistributes responsibilities among multiple sequencer nodes, enhancing system resilience and reducing dependence on a single point of failure. 
It contributes to a more distributed and robust system architecture.

3. The next stage focuses on implementing transaction encryption to protect against content-based attacks. 
Encryption mechanisms are incorporated to preserve the confidentiality of transaction data.
This strengthens the overall security of the system by making it more difficult for the [proposer](/docs/sequencer/lifecycle/ordering#malicious-proposer) to manipulate the order of transactions for malicious purposes.

4. The plan’s fourth step aims to restrict the proposer’s freedom in selecting and sequencing transactions. 
This is achieved by introducing mechanisms that impose an order based on trusted external sources or through consensus among validators. 
This approach enhances fairness, transparency, and decentralization in the transaction [ordering](/docs/sequencer/lifecycle/ordering) process, minimizing the potential for manipulation or biases. 
Further discussions are required to finalize the details of this step.

5. The final step involves gradually opening up the network, which was previously controlled by the Warp team. 
This phase occurs once the decentralization measures have been successfully implemented and thoroughly tested. 
Opening up the network fosters inclusivity, community involvement, and innovation, allowing external stakeholders to contribute, propose improvements, and participate in consensus and decision-making processes.

Through these steps, the Warp protocol aims to establish a decentralized sequencer network that not only ensures the reliable ordering and processing of transactions but also encourages community involvement and trust among participants.
By embracing decentralization, the Warp sequencer will pave the way for a more secure, scalable, and resilient future for the Warp contracts protocol and its ecosystem.