// ========================= steps/1-create-vpc.js =========================
import { EC2Client, CreateVpcCommand, DescribeVpcsCommand } from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { saveState, loadState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createVPC() {
  const state = loadState();
  if (state.vpcId) return console.log('VPC already exists:', state.vpcId);

  const res = await ec2.send(new CreateVpcCommand({
    CidrBlock: '10.0.0.0/16',
    TagSpecifications: [{ ResourceType: 'vpc', Tags: [{ Key: 'Name', Value: 'MyVPC' }] }]
  }));
  const vpcId = res.Vpc.VpcId;
  console.log('VPC Created:', vpcId);
  saveState({ vpcId });
}