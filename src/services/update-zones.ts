import { getAllZones } from "../api/core-service/zones";
import { database } from "../database";
import { assertIsDefined } from "../util/assert-defined";

type TreeNode = {
    id: string;
    displayZone: string | null;
    parent?: TreeNode;
}

const getImagePath = (file: string) => {
    const cleanedPath = file.replace("file://", "");
    const parts = cleanedPath.split('/');
    const fileNameWithExt = parts[parts.length - 1];
    const [fileName, extension] = fileNameWithExt.split('.');

    if (extension === "dds") {
        return `${fileName}.png`
    }
    return `${fileName}.${extension}`;
}

const getDisplayZone = (zone: TreeNode, nodeMap: Record<string, TreeNode>) => {
    const parents: string[] = [];
    let node: TreeNode | undefined = nodeMap[zone.id]
    while (node !== undefined) {
        parents.push(node.id);
        node = node.parent;
    }

    if (parents.length === 0) {
        throw new Error("Illegal State: Parents can't be empty.");
    }

    if (parents.length === 1 || parents.length === 2) {
        return null; // World or continent
    }

    return parents[parents.length - 3];
}

export const updateZones = async () => {
    const zones = await getAllZones();

    const nodeMap: Record<string, TreeNode> = {};

    for (const zone of zones) {
        nodeMap[zone.zoneId] = { id: zone.zoneId, displayZone: null, parent: undefined };
    }

    for (const zone of zones) {
        const node = nodeMap[zone.zoneId];
        if (zone.parentId === null) {
            continue;
        }

        const parent = nodeMap[zone.parentId];
        assertIsDefined(parent, `Parent of zone ${zone.name}`);
        node.parent = parent;
    }

    for (const zone of zones) {
        const node = nodeMap[zone.zoneId];
        node.displayZone = getDisplayZone(node, nodeMap);
    }

    for (const zone of zones) {
        const flag = getImagePath(zone.icon);
        await database.zone.upsert({
            where: {
                id: zone.zoneId,
            },
            create: {
                name: zone.name,
                flag: flag,
                id: zone.zoneId,
                displayId: null,
                parentId: null
            },
            update: {
                flag: flag,
                name: zone.name,
                displayId: null,
                parentId: null
            }
        });
    }

    for (const zone of zones) {
        const displayId = nodeMap[zone.zoneId].displayZone;
        if (zone.parentId === null || displayId === null) continue;

        await database.zone.update({
            where: { id: zone.zoneId },
            data: {
                parent: {
                    connect: { id: zone.parentId }
                },
                display: {
                    connect: { id: displayId }
                }
            }
        });
    }
}