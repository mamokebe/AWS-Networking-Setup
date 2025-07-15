// ========================= steps/8-create-security-groups.js =========================
import {
  EC2Client,
  CreateSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand
} from '@aws-sdk/client-ec2';
import { REGION } from '../config.js';
import { loadState, saveState } from '../state.js';

const ec2 = new EC2Client({ region: REGION });

export default async function createSecurityGroups() {
  const { vpcId } = loadState();

  const sgBastion = await ec2.send(new CreateSecurityGroupCommand({
    GroupName: 'BastionSG',
    Description: 'Allow SSH from anywhere',
    VpcId: vpcId,
  }));
  await ec2.send(new AuthorizeSecurityGroupIngressCommand({
    GroupId: sgBastion.GroupId,
    IpPermissions: [{
      IpProtocol: 'tcp',
      FromPort: 22,
      ToPort: 22,
      IpRanges: [{ CidrIp: '0.0.0.0/0' }]
    }]
  }));

  const sgPrivate = await ec2.send(new CreateSecurityGroupCommand({
    GroupName: 'PrivateSG',
    Description: 'Allow all outbound, deny inbound',
    VpcId: vpcId,
  }));

  console.log('Security groups created:', {
    BastionSG: sgBastion.GroupId,
    PrivateSG: sgPrivate.GroupId
  });
  saveState({ sgBastionId: sgBastion.GroupId, sgPrivateId: sgPrivate.GroupId });
}

