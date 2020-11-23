import Web3 from "web3";
import contract from "@truffle/contract";
import ElectionContract from "./contracts/Election.json";

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...

            emit('web3loading', { state: 0 })

            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    // await window.ethereum.enable();
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    emit('web3loading', { state: 1, message: 'window.ethereum' })
                    // Acccounts now exposed
                    resolve(web3);
                } catch (error) {
                    emit('web3loading', { state: -1, error })
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                emit('web3loading', { state: 1, message: 'window.web3' })
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    "http://127.0.0.1:7545"
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Local web3.");
                emit('web3loading', { state: 1, message: 'web3' })
                resolve(web3);
            }
        });
    });


export default async function vs() {

    const web3 = await getWeb3();
    try {
        emit('contract', { state: 0 })
        const Election = await contract(ElectionContract);
        await Election.setProvider(web3.currentProvider);
        const instance = await Election.deployed();
        emit('contract', { state: 1 })

        emit('contract', { state: 2 })
        const account = await web3.eth.getCoinbase();
        emit('contract', { state: 3, account })
        console.log('account:', account)

        instance.votedEvent(
            {
                fromBlock: 0,
            }, (a, e) => {
                const event = new window.CustomEvent("vote", {
                    detail: e,
                });
                document.dispatchEvent(event);
            }
        );
        console.log('vote event set')

        async function vote(candidateId) {
            try {
                return await instance.vote(candidateId, { from: account });
            } catch (error) {
                return false
            }
        }
        async function listCandidates() {
            const candidates = []
            const candidateCount = (await instance.candidatesCount()).toNumber();
            for (let i = 1; i <= candidateCount; i++) {
                const candidate = await instance.candidates(i);
                const candidateId = candidate[0].toNumber();
                const candidateName = candidate[1];
                const partyName = candidate[2];
                const candidateVotes = candidate[3].toNumber();
                const color = candidate[4];
                const logo = candidate[5];
                candidates.push({ id: candidateId, party: partyName, name: candidateName, votes: candidateVotes, color, logo })
            }
            return candidates
        }
        const hasVoted = await instance.voters(account);


        return { instance, account, vote, listCandidates, hasVoted }
    } catch (error) {
        emit('contract', { state: -1 })
        return false
    }

}

function emit(name, detail) {
    const event = new CustomEvent(name, { detail })
    document.dispatchEvent(event)
}