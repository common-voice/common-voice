import { getConfig } from '../config-helper';
import Model from './model';
import { Clip, TakeoutRequest } from 'common';
import { pipe } from 'fp-ts/lib/function';
import * as oci from 'oci-sdk';
import { task as T, taskEither as TE } from 'fp-ts';
import * as fs from 'fs';

// Utility to convert a stream to a buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

export default class Bucket {
  private model: Model;
  private objectStorageClient: oci.objectstorage.ObjectStorageClient;
  private namespace: string;

  constructor(model: Model) {
    this.model = model;

    // Helper to load OCI configuration
    const getociConfig = () => ({
      OCI_TENANCY_ID: getConfig().OCI_TENANCY_ID || '',
      OCI_USER_ID: getConfig().OCI_USER_ID || '',
      OCI_FINGERPRINT: getConfig().OCI_FINGERPRINT || '',
      OCI_PRIVATE_KEY_PATH: getConfig().OCI_PRIVATE_KEY_PATH || '',
      OCI_REGION: getConfig().OCI_REGION || '',
      OCI_NAMESPACE: getConfig().OCI_NAMESPACE || '',
      OCI_BUCKET_NAME: getConfig().OCI_BUCKET_NAME || '',
    });

    // Helper to load the private key
    const loadPrivateKey = (filePath: string): string => {
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        throw new Error(`Failed to load private key from file: ${err.message}`);
      }
    };

    // Load configuration
    const config = getociConfig();
    this.namespace = config.OCI_NAMESPACE;

    // Validate required configuration
    const missingConfigs = [];
    if (!config.OCI_TENANCY_ID) missingConfigs.push('OCI_TENANCY_ID');
    if (!config.OCI_USER_ID) missingConfigs.push('OCI_USER_ID');
    if (!config.OCI_FINGERPRINT) missingConfigs.push('OCI_FINGERPRINT');
    if (!config.OCI_PRIVATE_KEY_PATH) missingConfigs.push('OCI_PRIVATE_KEY_PATH');
    if (!config.OCI_REGION) missingConfigs.push('OCI_REGION');
    if (!config.OCI_NAMESPACE) missingConfigs.push('OCI_NAMESPACE');
    if (!config.OCI_BUCKET_NAME) missingConfigs.push('OCI_BUCKET_NAME');

    if (missingConfigs.length > 0) {
      throw new Error(`Missing required OCI configuration values: ${missingConfigs.join(', ')}`);
    }

    // Initialize OCI client
    const region = oci.common.Region.fromRegionId(config.OCI_REGION);
    const privateKey = loadPrivateKey(config.OCI_PRIVATE_KEY_PATH);

    const provider = new oci.common.SimpleAuthenticationDetailsProvider(
      config.OCI_TENANCY_ID,
      config.OCI_USER_ID,
      config.OCI_FINGERPRINT,
      privateKey,
      null, // passphrase (if any)
      region
    );

    this.objectStorageClient = new oci.objectstorage.ObjectStorageClient({
      authenticationDetailsProvider: provider,
    });
  }

  /**
   * Fetch a public URL for the resource.
   */
  public async getPublicUrl(key: string, bucketType?: string): Promise<string> {
    const { DATASET_BUCKET_NAME, CLIP_BUCKET_NAME, OCI_REGION } = getConfig();
    const bucket = bucketType === 'dataset' ? DATASET_BUCKET_NAME : CLIP_BUCKET_NAME;
    // const uploadedPath = `https://objectstorage.${OCI_CONFIG.region}.oraclecloud.com/n/${this.namespace}/b/${this.bucketName}/o/${path}`;
    return `https://objectstorage.${OCI_REGION}.oci.customer-oci.com/n/${
      this.namespace
    }/b/${bucket}/o/${encodeURIComponent(key)}`;
  }

  /**
   * Construct the public URL for a resource that needs no token.
   */
  public async getUnsignedUrl(bucket: string, key: string): Promise<string> {
    return await this.getPublicUrl(key);
  }

  /**
   * Delete function for OCI used for removing old avatars.
   */
  public async deleteAvatar(client_id: string, url: string): Promise<void> {
    const urlParts = url.split('/');
    if (urlParts.length) {
      const fileName = urlParts[urlParts.length - 1];
      await this.deletePath(`${client_id}/${fileName}`);
    }
  }

  /**
   * Check if a given file exists in the bucket.
   */
  async fileExists(path: string): Promise<boolean> {
    const { CLIP_BUCKET_NAME } = getConfig();
    return pipe(
      TE.tryCatch(
        async () => {
          await this.objectStorageClient.getObject({
            namespaceName: this.namespace,
            bucketName: CLIP_BUCKET_NAME,
            objectName: path,
          });
          return true;
        },
        error => {
          if ((error as any).statusCode === 404) return false; // Object not found
          throw new Error(String(error));
        }
      ),
      TE.getOrElse(() => T.of(false))
    )();
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(client_id: string, locale: string, count: number): Promise<Clip[]> {
    // Placeholder implementation, replace with actual logic
    return [];
  }

  /**
   * Generate a key for takeout files.
   */
  takeoutKey(takeout: TakeoutRequest, chunkIndex: number): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_pt_${chunkIndex}.zip`;
  }

  /**
   * Generate a key for takeout metadata.
   */
  metadataKey(takeout: TakeoutRequest): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_metadata.txt`;
  }
  /**
   * Get the URL for avatar clips.
   */
  async getAvatarClipsUrl(path: string): Promise<string> {
    return await this.getPublicUrl(path);
  }

  /**
   * Get the URL for a specific clip.
   */
  async getClipUrl(id: string): Promise<string> {
    const clip = await this.model.db.findClip(id);
    return clip ? this.getPublicUrl(clip.path) : null;
  }

  /**
   * Delete a file from the bucket.
   */
  public async deletePath(path: string): Promise<void> {
    const { CLIP_BUCKET_NAME } = getConfig();
    await this.objectStorageClient.deleteObject({
      namespaceName: this.namespace,
      bucketName: CLIP_BUCKET_NAME,
      objectName: path,
    });
  }
}
