import { Suspense, useEffect, useState } from 'react';

// component
import Import from './Import';

// utils
import { getSigner } from '../helpers/utils';

// constants
import { SALTED_UP_FACTORY_ADDRESS } from '../helpers/constants';

// types
import {
	SaltedUniversalProfileFactory,
	SaltedUniversalProfileFactory__factory,
} from '../types';
import UniversalProfileCard from './UniversalProfileCard';

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

				const newDeployedUniversalProfiles =
					await saltedUniversalProfileFactory.getDeployedUniversalProfiles(
						signerAddress
					);
				setDeployedUniversalProfiles(newDeployedUniversalProfiles);

				const newExportedUniversalProfiles =
					await saltedUniversalProfileFactory.getExportedUniversalProfiles(
						signerAddress
					);
				setExportedUniversalProfiles(newExportedUniversalProfiles);
			}
		};

		if (connected) {
			sortDeployedUniversalProfiles().then(() => {});
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
