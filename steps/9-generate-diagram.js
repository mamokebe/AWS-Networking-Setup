// steps/9-generate-diagram.js
import { loadState } from '../state.js';
import { writeFileSync } from 'fs';

export default async function generateDiagram() {
  const state = loadState();

  const diagram = `
\`\`\`mermaid
graph TD
  VPC["VPC (${state.vpcId})"]
  IGW["Internet Gateway (${state.igwId})"]
  NAT["NAT Gateway (${state.natGatewayId || 'N/A'})"]
  PUB["Public Subnet (${state.publicSubnetId})"]
  PRIV["Private Subnet (${state.privateSubnetId})"]
  RT1["Public Route Table (${state.rtPublicId || '...auto'})"]
  RT2["Private Route Table (${state.rtPrivateId || '...pending'})"]

  VPC --> IGW
  VPC --> PUB
  VPC --> PRIV
  PUB --> RT1 --> IGW
  PRIV --> RT2 --> NAT
\`\`\`
`;

  writeFileSync('vpc-architecture.md', diagram);
  console.log('Mermaid diagram written to vpc-architecture.md');
}
