// ========================= steps/6-create-nat-gateway.js =========================
import { EC2Client, AllocateAddressCommand, CreateNatGatewayCommand } from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, saveState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createNATGateway() {
  const state = loadState();
  if (state.natGatewayId) return console.log('NAT Gateway already exists:', state.natGatewayId);

  const eip = await ec2.send(new AllocateAddressCommand({ Domain: 'vpc' }));
  const nat = await ec2.send(new CreateNatGatewayCommand({
    SubnetId: state.publicSubnetId,
    AllocationId: eip.AllocationId,
    TagSpecifications: [{ ResourceType: 'natgateway', Tags: [{ Key: 'Name', Value: 'MyNATGateway' }] }],
  }));
  console.log('NAT Gateway ID:', nat.NatGateway.NatGatewayId);
  saveState({ natGatewayId: nat.NatGateway.NatGatewayId });
}