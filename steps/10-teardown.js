// ========================= steps/8-teardown.js =========================
import { EC2Client, DeleteVpcCommand } from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, clearState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function teardown() {
  const { vpcId } = loadState();
  if (!vpcId) return console.log('No VPC found to delete.');

  console.log('Teardown is destructive. Proceed carefully.');
  await ec2.send(new DeleteVpcCommand({ VpcId: vpcId }));
  console.log('VPC deleted. You must manually delete dependent resources if not deleted automatically.');
  clearState();
}