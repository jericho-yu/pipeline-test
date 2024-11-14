import { generatePipeline } from './util/pipeline-builder.js';

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

// json -> pipeline
export const toPipeline = (jsonContent = {}) => {
	let level = 1;
	let content = generatePipeline(fileContent, level);

	return `${xmlStart}${content}${xmlEnd}`;
};