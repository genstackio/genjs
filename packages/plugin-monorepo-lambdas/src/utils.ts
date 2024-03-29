export const applySort = (a, b) => a > b ? 1 : (a === b ? 0 : -1);
export const applySortBy = (a, b, k) => applySort(a[k], b[k]);
export const applySortBys = (a, b, ks) => applySortBy(a, b, ks.find(k => !!a[k]));

export const buildTechnologiesVars = (vars: any): {
    originalTechnologies: any,
    sortedTechnologies: any[],
} => {
    const originalTechnologies = vars.technologies || {};
    const sortedTechnologies = Object.entries(originalTechnologies).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedTechnologies.sort((a, b) => a.name > b.name ? 1 : (a.name === b.name ? 0 : -1));
    return {
        originalTechnologies,
        sortedTechnologies,
    };
};
export const buildPreRequisitesVars = (vars: any): {
    originalPreRequisites: any,
    sortedPreRequisites: any[],
} => {
    const originalPreRequisites = vars.preRequisites || {};
    const sortedPreRequisites = Object.entries(originalPreRequisites).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    //sortedPreRequisites.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalPreRequisites,
        sortedPreRequisites,
    };
};
export const buildInstallProceduresVars = (vars: any): {
    originalInstallProcedures: any,
    sortedInstallProcedures: any[],
} => {
    const originalInstallProcedures = vars.installProcedures || {};
    const sortedInstallProcedures = Object.entries(originalInstallProcedures).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    //sortedInstallProcedures.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalInstallProcedures,
        sortedInstallProcedures,
    };
};
export const buildProjectEnvsVars = (vars: any): {
    originalProjectEnvs: any,
    sortedProjectEnvs: any[],
} => {
    const originalProjectEnvs = vars.project_envs || {};
    const sortedProjectEnvs = Object.entries(originalProjectEnvs).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedProjectEnvs.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalProjectEnvs,
        sortedProjectEnvs,
    };
};

export const buildProjectsVars = (vars: any): {
    originalProjects: any,
    sortedProjects: any[],
    deployableProjects: any[],
    migratableProjects: any[],
    buildableProjects: any[],
    buildablePreProjects: any[],
    buildablePostProjects: any[],
    testableProjects: any[],
    generateEnvLocalableProjects: any[],
    preInstallableProjects: any[],
    installableProjects: any[],
    startableProjects: any[],
    refreshableProjects: any[],
    loggableProjects: any[],
} => {
    const originalProjects = vars.projects || {};
    const sortedProjects = Object.entries(originalProjects).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedProjects.sort((a, b) => a.name > b.name ? 1 : (a.name === b.name ? 0 : -1));
    const deployableProjects = sortedProjects.filter(p => !!p.deployable);
    const migratableProjects = sortedProjects.filter(p => !!p.migratable);
    const buildableProjects = sortedProjects.filter(p => !!p.buildable);
    const buildablePreProjects = buildableProjects.filter(p => 'pre' === p.phase);
    const buildablePostProjects = buildableProjects.filter(p => 'pre' !== p.phase);
    const testableProjects = sortedProjects.filter(p => !!p.testable);
    const generateEnvLocalableProjects = sortedProjects.filter(p => !!p.generateEnvLocalable);
    const preInstallableProjects = sortedProjects.filter(p => !!p.preInstallable);
    const installableProjects = sortedProjects.filter(p => !!p.installable);
    const startableProjects = sortedProjects.filter(p => !!p.startable);
    const refreshableProjects = sortedProjects.filter(p => !!p.refreshable);
    const loggableProjects = sortedProjects.filter(p => !!p.loggable);
    return {
        originalProjects,
        sortedProjects,
        migratableProjects,
        deployableProjects,
        buildableProjects,
        buildablePreProjects,
        buildablePostProjects,
        testableProjects,
        generateEnvLocalableProjects,
        preInstallableProjects,
        installableProjects,
        startableProjects,
        refreshableProjects,
        loggableProjects,
    };
};
