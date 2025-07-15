// ========================= steps/2-create-subnets.js =========================
import { EC2Client, DescribeAvailabilityZonesCommand, CreateSubnetCommand } from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, saveState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createSubnets() {
  const state = loadState();
  if (state.publicSubnetId && state.privateSubnetId) return console.log('Subnets already exist.');

  const { vpcId } = state;
  const zones = await ec2.send(new DescribeAvailabilityZonesCommand({}));
  const az = zones.AvailabilityZones[0].ZoneName;

  const publicSubnet = await ec2.send(new CreateSubnetCommand({
    VpcId: vpcId,
    CidrBlock: '10.0.1.0/24',
    AvailabilityZone: az,
    TagSpecifications: [{ ResourceType: 'subnet', Tags: [{ Key: 'Name', Value: 'PublicSubnet' }] }],
  }));

  const privateSubnet = await ec2.send(new CreateSubnetCommand({
    VpcId: vpcId,
    CidrBlock: '10.0.2.0/24',
    AvailabilityZone: az,
    TagSpecifications: [{ ResourceType: 'subnet', Tags: [{ Key: 'Name', Value: 'PrivateSubnet' }] }],
  }));

  console.log('Public Subnet:', publicSubnet.Subnet.SubnetId);
  console.log('Private Subnet:', privateSubnet.Subnet.SubnetId);
  saveState({ publicSubnetId: publicSubnet.Subnet.SubnetId, privateSubnetId: privateSubnet.Subnet.SubnetId });
}