// ========================= cli.js =========================
import inquirer from 'inquirer';
// Add to steps array:
const steps = [
  'Create VPC',
  'Create Subnets',
  'Create Internet Gateway',
  'Create Bastion Host',
  'Create NAT Instance',
  'Create NAT Gateway',
  'Create Route Tables + NAT Association',
  'Create Security Groups',
  'Generate Architecture Diagram',
  'Teardown All Resources'
];

const stepMap = {
  0: () => import('./steps/1-create-vpc.js'),
  1: () => import('./steps/2-create-subnets.js'),
  2: () => import('./steps/3-create-igw.js'),
  3: () => import('./steps/4-create-bastion.js'),
  4: () => import('./steps/5-create-nat-instance.js'),
  5: () => import('./steps/6-create-nat-gateway.js'),
  6: () => import('./steps/7-create-route-tables.js'),
  7: () => import('./steps/8-create-security-groups.js'),
  8: ()=> import('./steps/9-generate-diagram.js'),
  9: () => import('./steps/10-teardown.js'),
};

(async () => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select a step to run:',
      choices: steps
    }
  ]);
  const index = steps.indexOf(choice);
  const step = await stepMap[index]();
  await step.default();
})();

