import { Suspense, useEffect, useState } from 'react';
import { concat, toBeHex, toNumber } from 'ethers';

// components
import Import from './Import';
import UniversalProfileCard from './UniversalProfileCard';

// utils
import { getSigner } from '../helpers/utils';

// constants
import {
	DEPLOYED_SALTED_UP_ARRAY_KEY,
	DEPLOYED_SALTED_UP_ARRAY_MAP_PREFIX,
	SALTED_UP_FACTORY_ADDRESS,
} from '../helpers/constants';

// types
import {
	SaltedUniversalProfileFactory,
	SaltedUniversalProfileFactory__factory,
} from '../types';

interface Props {
	connected: boolean;
	setError: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
}

const DeployedUPs: React.FC<Props> = ({ connected, setError }) => {
	const [deployedUniversalProfiles, setDeployedUniversalProfiles] =
		useState<string[]>();
	const [exportedUniversalProfiles, setExportedUniversalProfiles] =
		useState<string[]>();

	useEffect(() => {
		const sortDeployedUniversalProfiles = async () => {
			const { signer, error } = await getSigner();

			if (error) {
				setError(error);
			} else {
				const signerAddress = await signer.getAddress();

				const saltedUniversalProfileFactory =
					new SaltedUniversalProfileFactory__factory()
						.attach(SALTED_UP_FACTORY_ADDRESS)
						.connect(signer) as SaltedUniversalProfileFactory;

				const deployedUnviersalProfilesDataValue =
					await saltedUniversalProfileFactory.getData(
						DEPLOYED_SALTED_UP_ARRAY_KEY
					);

				if (deployedUnviersalProfilesDataValue === '0x') {
					return;
				}

				const deployedUnviersalProfilesCount = toNumber(
					deployedUnviersalProfilesDataValue
				);

				const newDeployedUniversalProfiles: string[] = [];
				const newExportedUniversalProfiles: string[] = [];
				for (
					let index = 0;
					index < deployedUnviersalProfilesCount;
					index++
				) {
					const deployedUniversalProfile =
						await saltedUniversalProfileFactory.getData(
							concat([
								DEPLOYED_SALTED_UP_ARRAY_KEY.substring(0, 34),
								toBeHex(index, 16),
							])
						);

					const deployedUniversalProfileMap =
						await saltedUniversalProfileFactory.getData(
							concat([
								DEPLOYED_SALTED_UP_ARRAY_MAP_PREFIX,
								'0x0000',
								deployedUniversalProfile,
							])
						);

					const unviersalProfileOwner =
						deployedUniversalProfileMap.substring(0, 42);
					const universalProfileExported =
						deployedUniversalProfileMap.substring(42) === '01'
							? true
							: false;

					if (unviersalProfileOwner === signerAddress.toLowerCase()) {
						if (universalProfileExported) {
							newExportedUniversalProfiles.push(
								deployedUniversalProfile
							);
						} else {
							newDeployedUniversalProfiles.push(
								deployedUniversalProfile
							);
						}
					}
				}

				setDeployedUniversalProfiles(newDeployedUniversalProfiles);
				setExportedUniversalProfiles(newExportedUniversalProfiles);
			}
		};

		if (connected) {
			sortDeployedUniversalProfiles();
		}
	}, [connected, setError]);

	return (
		<Suspense>
			{deployedUniversalProfiles?.map((universalProfileAddress) => (
				<UniversalProfileCard
					key={universalProfileAddress}
					universalProfileAddress={universalProfileAddress}
					chainId={4201}
				>
					<Import
						setError={setError}
						universalProfileAddress={universalProfileAddress}
					/>
				</UniversalProfileCard>
			))}
			{exportedUniversalProfiles?.map((universalProfileAddress) => (
				<UniversalProfileCard
					key={universalProfileAddress}
					universalProfileAddress={universalProfileAddress}
					chainId={4201}
				/>
			))}
		</Suspense>
	);
};

export default DeployedUPs;
