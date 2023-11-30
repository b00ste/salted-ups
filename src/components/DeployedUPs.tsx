import { Suspense, useEffect, useState } from 'react';

// component
import Import from './Import';

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
import UniversalProfileCard from './UniversalProfileCard';
import { AbiCoder, concat, toBeHex, toNumber } from 'ethers';

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

				const deployedUnviersalProfilesCount = toNumber(
					await saltedUniversalProfileFactory.getData(
						DEPLOYED_SALTED_UP_ARRAY_KEY
					)
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
								deployedUniversalProfile,
							])
						);

					const [unviersalProfileOwner, universalProfileExported] =
						new AbiCoder().decode(
							['address', 'bool'],
							deployedUniversalProfileMap
						);
					console.log(unviersalProfileOwner);
					console.log(universalProfileExported);
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
				>
					{exportedUniversalProfiles?.includes(
						universalProfileAddress
					) ? (
						<p className="mt-6 text-center">
							Universal Profile was already imported to a Browser
							Extension
						</p>
					) : (
						<Import
							setError={setError}
							universalProfileAddress={universalProfileAddress}
						/>
					)}
				</UniversalProfileCard>
			))}
		</Suspense>
	);
};

export default DeployedUPs;
