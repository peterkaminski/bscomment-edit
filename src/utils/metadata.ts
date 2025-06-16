import { BsCommentMetadata, ParsedMetadata } from '../types';
import { validateGitHubRepo, validateFilePath } from './validation';

export function extractMetadataFromHtml(htmlContent: string): BsCommentMetadata | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const repoMeta = doc.querySelector('meta[name="markpub:repo"]');
  const filepathMeta = doc.querySelector('meta[name="markpub:filepath"]');
  const generatedMeta = doc.querySelector('meta[name="markpub:generated"]');
  const generatorMeta = doc.querySelector('meta[name="markpub:generator"]');

  if (!repoMeta || !filepathMeta || !generatedMeta || !generatorMeta) {
    return null;
  }

  return {
    repo: repoMeta.getAttribute('content') || '',
    filepath: filepathMeta.getAttribute('content') || '',
    generated: generatedMeta.getAttribute('content') || '',
    generator: generatorMeta.getAttribute('content') || ''
  };
}

export function parseMetadata(metadata: BsCommentMetadata): ParsedMetadata | null {
  const { repo, filepath, generated, generator } = metadata;

  const repoValidation = validateGitHubRepo(repo);
  if (!repoValidation.isValid) {
    throw new Error(`Invalid repository URL: ${repoValidation.error}`);
  }

  const filepathValidation = validateFilePath(filepath);
  if (!filepathValidation.isValid) {
    throw new Error(`Invalid file path: ${filepathValidation.error}`);
  }

  const repoMatch = repo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!repoMatch) {
    throw new Error('Could not parse repository owner and name');
  }

  const [, owner, repoName] = repoMatch;

  return {
    repoUrl: repo.replace(/\/$/, ''),
    owner: owner,
    repoName: repoName,
    filePath: filepath,
    generated,
    generator
  };
}

export function addTimestampComment(htmlContent: string): string {
  const timestamp = new Date().toISOString();
  const comment = `<!-- bsComment Editor: Updated ${timestamp} -->`;
  
  const bodyCloseTag = '</body>';
  const bodyCloseIndex = htmlContent.lastIndexOf(bodyCloseTag);
  
  if (bodyCloseIndex === -1) {
    return htmlContent + '\n' + comment;
  }
  
  return htmlContent.slice(0, bodyCloseIndex) + 
         comment + '\n' + 
         htmlContent.slice(bodyCloseIndex);
}