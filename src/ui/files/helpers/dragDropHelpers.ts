import { fileStore } from 'peerio-icebear';
import { FileFolder } from 'peerio-icebear/dist/models';
import { getFileTree, FileTree } from '~/helpers/file';

export function getAllDraggedItems() {
    return {
        filesOrFolders: fileStore.selectedFilesOrFolders,
        files: fileStore.selectedFiles,
        folders: fileStore.selectedFolders
    };
}

export async function uploadDroppedFiles(
    files: { path: string }[],
    targetFolder: FileFolder
): Promise<void> {
    const trees: FileTree[] = [];
    for (let i = 0; i < files.length; i++) {
        const tree = await getFileTree(files[i].path);
        if (tree) trees.push(tree);
    }

    await Promise.map(trees, tree => {
        if (typeof tree === 'string') {
            fileStore.upload(tree, null, targetFolder);
            return Promise.resolve();
        }
        return fileStore.uploadFolder(tree, targetFolder);
    });
}
