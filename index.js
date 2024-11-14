import { generatePipeline } from './util/pipeline-builder.js';
import fs from 'fs/promises';


async function main() {
	let xmlStart = `<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@1385.vb_58b_86ea_fff1">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@2.2151.ve32c9d209a_3f"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@2.2151.ve32c9d209a_3f">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>7</daysToKeep>
        <numToKeep>5</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@3826.v3b_5707fe44da_">
    <script>`;
	let xmlEnd = `</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>`;

	// 读取文件
	try {
		const fileContentJson = await fs.readFile('./config.json', 'utf8');
		let fileContent = JSON.parse(fileContentJson);  // 解析json字符串
		// 构建pipeline脚本
		let level = 1;

		let content = generatePipeline(fileContent, level);

		// 保存文本到文件
		await fs.writeFile('./pipeline.xml', `${xmlStart}${content}${xmlEnd}`, 'utf8');
		console.log('Pipeline script saved to pipeline.xml');
	} catch (err) {
		console.error("Error reading file" + err)
		return;
	}
}

main();