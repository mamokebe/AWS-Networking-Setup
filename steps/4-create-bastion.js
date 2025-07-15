// ========================= steps/4-create-bastion.js =========================
import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';
import { REGION, AMI_ID, KEY_NAME } from '../config.js';
import { loadState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createBastion() {
  const { publicSubnetId } = loadState();
  const res = await ec2.send(new RunInstancesCommand({
    ImageId: AMI_ID,
    InstanceType: 't2.micro',
    KeyName: KEY_NAME,
    SubnetId: publicSubnetId,
    AssociatePublicIpAddress: true,
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{ ResourceType: 'instance', Tags: [{ Key: 'Name', Value: 'BastionHost' }] }],
  }));
  console.log('Bastion Host ID:', res.Instances[0].InstanceId);
}

