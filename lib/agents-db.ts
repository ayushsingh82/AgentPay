// Shared agents database - replace with your actual database
// This stores off-chain metadata (category, description, endpointUrl, etc.)
let agents: any[] = [];

export function getAllAgents() {
  return agents;
}

export function getAgentById(id: number) {
  return agents.find(a => a.id === id);
}

export function addAgent(agent: any) {
  agents.push(agent);
  return agent;
}

export function updateAgent(id: number, updates: Partial<any>) {
  const index = agents.findIndex(a => a.id === id);
  if (index !== -1) {
    agents[index] = { ...agents[index], ...updates };
    return agents[index];
  }
  return null;
}

