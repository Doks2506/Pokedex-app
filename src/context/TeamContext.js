import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../components/Loading";

export const MAX_TEAM_SIZE = 6;
const TEAM_KEY = "pokedex-team-v1";

const TeamContext = createContext(null);

export function useTeam() {
  return useContext(TeamContext);
}

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadSavedTeam() {
      try {
        const saved = await AsyncStorage.getItem(TEAM_KEY);
        if (saved) setTeam(JSON.parse(saved));
      } catch (error) {
        console.warn("Could not restore saved team:", error.message);
      } finally {
        setReady(true);
      }
    }

    loadSavedTeam();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team)).catch((error) =>
        console.warn("Could not save team:", error.message)
      );
    }
  }, [team, ready]);

  const addToTeam = (details) => {
    if (team.some((member) => member.id === details.id)) return true;
    if (team.length >= MAX_TEAM_SIZE) return false;

    const member = {
      id: details.id,
      name: details.name,
      types: details.types,
      stats: details.stats,
      height: details.height,
      weight: details.weight,
    };

    setTeam((previous) => [...previous, member]);
    return true;
  };

  const removeFromTeam = (id) => {
    setTeam((previous) => previous.filter((member) => member.id !== id));
  };

  if (!ready) return <Loading />;

  return (
    <TeamContext.Provider value={{ team, addToTeam, removeFromTeam }}>
      {children}
    </TeamContext.Provider>
  );
}
