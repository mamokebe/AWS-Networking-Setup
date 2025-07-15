// ========================= steps/5-create-nat-instance.js =========================
import { EC2Client, RunInstancesCommand } from '@aws-sdk/client-ec2';
import { REGION, AMI_ID, KEY_NAME,NAT_SG } from '../config.js';
import { loadState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createNATInstance() {
  const { publicSubnetId } = loadState();
  const res = await ec2.send(new RunInstancesCommand({
    ImageId: AMI_ID,
    InstanceType: 't3.micro',
    KeyName: KEY_NAME,
    SubnetId: publicSubnetId,
    MinCount: 1,
    MaxCount: 1,
    SecurityGroupIds: NAT_SG,  
    TagSpecifications: [{ ResourceType: 'instance', Tags: [{ Key: 'Name', Value: 'NATInstance' }] }],
  }));
  console.log('NAT Instance ID:', res.Instances[0].InstanceId);
}