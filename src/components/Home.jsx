import React, { useContext, useEffect, useState } from "react";

import { Collapse, Button, Dialog, LinearProgress } from "@material-ui/core";
import { GlobalContext } from "../GlobalContext";

import "./css/home.css";

export default function Home() {
  const voteController = useContext(GlobalContext);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (voteController) {
      const onvote = (e) => {
        setLoading(true);
        voteController.listCandidates().then((cans) => {
          setCandidates(cans);
          setLoading(false);
        });
      };
      document.addEventListener("vote", onvote);
      return () => document.removeEventListener("vote", onvote);
    }
  }, [voteController]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      voteController.listCandidates().then((cans) => {
        setCandidates(cans);
        setLoading(false);
      });
    }, 10000);
    setHasVoted(voteController.hasVoted);
    return () => clearInterval(interval);
  }, [voteController]);

  return (
    <div className="home-page">
      <header>
        <h1>Voting System</h1>
        <p>Your account</p>
        <p>{voteController.account}</p>
        {hasVoted ? (
          <div className="has-voted">
            <h3>You have already voted</h3>
            <p>If this was not you </p>
            <Button
              variant="outlined"
              style={{ color: "red", border: "1px solid red" }}
            >
              Report
            </Button>
          </div>
        ) : (
          <></>
        )}
      </header>
      <div className="candidates-section">
        <h1>Candidates</h1>
        {loading ? <LinearProgress /> : <></>}
        <div className="candidates">
          {candidates.map((candidate, i) => (
            <Candidate
              key={i}
              candidate={candidate}
              vote={voteController.vote}
              voted={hasVoted}
              setVoted={setHasVoted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Candidate({ candidate, vote, voted, setVoted }) {
  const [state, setState] = useState(false);
  const [votingDialog, setVotingDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setState(true);
  }, []);
  return (
    <Collapse in={state}>
      <Dialog
        open={votingDialog && !voted}
        onClose={() => setVotingDialog(false)}
      >
        <div className="confirmation">
          <img src={candidate.logo} alt="" className="logo" />
          <h2>You are voting for</h2>
          <p className="candidate-name-dialog">{candidate.name}</p>
          <p
            className="candidate-party-dialog"
            style={{ color: candidate.color }}
          >
            {candidate.party}
          </p>
          <div className="voting-actions">
            <Button
              className="voting-action-button"
              id="cancel-voting-btn"
              variant="outlined"
              style={{ marginRight: "20px" }}
              onClick={() => setVotingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              id="vote-btn"
              className="voting-action-button"
              variant="outlined"
              onClick={async () => {
                setLoading(true);
                if (await vote(candidate.id)) {
                  setVoted(true);
                  setLoading(false);
                }
              }}
            >
              Vote for {candidate.name}
            </Button>
          </div>
          <div className="vote-warning">
            <p>This action cannot be redone or undone after you vote</p>
          </div>
        </div>
        {loading ? <LinearProgress /> : <></>}
      </Dialog>
      <div
        className="candidate"
        style={{ border: "1px solid " + candidate.color }}
      >
        <div className="left">
          <div className="votes">
            <h3 style={{ color: candidate.color }}>{candidate.votes}</h3>
            <span>{candidate.votes === 1 ? "vote" : "votes"}</span>
          </div>
          <h2>{candidate.name}</h2>
          <Button variant="outlined" style={{ color: candidate.color }}>
            {candidate.party}
          </Button>
        </div>
        <div className="right">
          <img src={candidate.logo} alt="" className="logo" />
          <Button
            disabled={!!voted}
            onClick={() => setVotingDialog(true)}
            variant="outlined"
            style={{
              color: candidate.color,
              opacity: voted ? 0.4 : 1,
            }}
          >
            Vote
          </Button>
        </div>
      </div>
    </Collapse>
  );
}
