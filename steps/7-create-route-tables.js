// ========================= steps/7-create-route-tables.js =========================
import {
  EC2Client,
  CreateRouteTableCommand,
  CreateRouteCommand,
  AssociateRouteTableCommand
} from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, saveState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createRouteTables() {
  const { vpcId, publicSubnetId, privateSubnetId, igwId, natGatewayId } = loadState();

  const rtPublic = await ec2.send(new CreateRouteTableCommand({ VpcId: vpcId }));
  await ec2.send(new CreateRouteCommand({
    RouteTableId: rtPublic.RouteTable.RouteTableId,
    DestinationCidrBlock: '0.0.0.0/0',
    GatewayId: igwId,
  }));
  await ec2.send(new AssociateRouteTableCommand({
    RouteTableId: rtPublic.RouteTable.RouteTableId,
    SubnetId: publicSubnetId,
  }));
  console.log('Public Route Table associated.');

  if (natGatewayId) {
    const rtPrivate = await ec2.send(new CreateRouteTableCommand({ VpcId: vpcId }));
    await ec2.send(new CreateRouteCommand({
      RouteTableId: rtPrivate.RouteTable.RouteTableId,
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: natGatewayId,
    }));
    await ec2.send(new AssociateRouteTableCommand({
      RouteTableId: rtPrivate.RouteTable.RouteTableId,
      SubnetId: privateSubnetId,
    }));
    console.log('Private Route Table associated with NAT Gateway.');
    saveState({ rtPublicId: rtPublic.RouteTable.RouteTableId, rtPrivateId: rtPrivate.RouteTable.RouteTableId });
  } else {
    console.log('NAT Gateway ID missing. Skipping private route table creation.');
  }
}
