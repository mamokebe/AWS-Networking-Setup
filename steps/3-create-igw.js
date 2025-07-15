// ========================= steps/3-create-igw.js =========================
import { EC2Client, CreateInternetGatewayCommand, AttachInternetGatewayCommand } from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, saveState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createIGW() {
  const state = loadState();
  if (state.igwId) return console.log('Internet Gateway already exists:', state.igwId);

  const igw = await ec2.send(new CreateInternetGatewayCommand({
    TagSpecifications: [{ ResourceType: 'internet-gateway', Tags: [{ Key: 'Name', Value: 'MyIGW' }] }],
  }));
  await ec2.send(new AttachInternetGatewayCommand({
    VpcId: state.vpcId,
    InternetGatewayId: igw.InternetGateway.InternetGatewayId,
  }));
  console.log('Internet Gateway Attached:', igw.InternetGateway.InternetGatewayId);
  saveState({ igwId: igw.InternetGateway.InternetGatewayId });
}

