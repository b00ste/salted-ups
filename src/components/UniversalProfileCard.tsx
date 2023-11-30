import { PropsWithChildren } from 'react';
import { useUniversalProfileData } from '../helpers/utils';

interface Props {
	universalProfileAddress: string;
	chainId: number;
}

const UniversalProfileCard: React.FC<PropsWithChildren<Props>> = ({
	universalProfileAddress,
	chainId,
	children,
}) => {
	const {
		name,
		description,
		profileImageUrl,
		backgroundImageUrl,
		links,
		tags,
		error,
	} = useUniversalProfileData(universalProfileAddress, chainId);

	return (
		<lukso-card
			variant="profile"
			background-url={backgroundImageUrl}
			profile-url={profileImageUrl}
			profile-address={universalProfileAddress}
			class="mb-4 rounded-24 shadow-neutral-drop-shadow-1xl hover:shadow-neutral-drop-shadow-2xl transition-all"
			custom-class="rounded-24"
			size="small"
		>
			<div
				slot="content"
				className="mx-6 mb-6 flex flex-col items-center"
			>
				<lukso-username
					size="medium"
					name={name || 'anonymous'}
					address={universalProfileAddress}
					custom-class="cursor-pointer"
					onClick={() =>
						window.open(
							`https://wallet.universalprofile.cloud/${universalProfileAddress}`,
							'_blank',
							'noopener,noreferrer'
						)
					}
				></lukso-username>
				<div className="hover:cursor-pointer hover:opacity-80">
					<lukso-username
						size="medium"
						address={universalProfileAddress}
						address-color="purple-51"
						onClick={() => {
							navigator.clipboard.writeText(
								universalProfileAddress
							);
						}}
					/>
				</div>
				<div
					className={`${
						Object.getOwnPropertyNames(links).length === 0
							? 'hidden'
							: 'flex'
					} mt-2 mb-2 pt-2 border-t-2`}
				>
					{links ? (
						Object.getOwnPropertyNames(links).map((index) => (
							<div className="mx-1" key={index}>
								{'| '}
								<a
									href={links[Number(index)].url}
									target="_blank"
									rel="noreferrer"
									className="hover:underline text-purple-51 hover:text-purple-41 font-600"
								>
									{links[Number(index)].title}
								</a>
							</div>
						))
					) : (
						<></>
					)}
					{' |'}
				</div>
				<div
					className={`${
						Object.getOwnPropertyNames(links).length === 0
							? 'hidden'
							: 'flex'
					} mt-2 mb-2 pt-2 border-t-2`}
				>
					{tags ? (
						Object.getOwnPropertyNames(tags).map((index) => (
							<div className="mx-1" key={tags[Number(index)]}>
								<lukso-tag size="small">
									{tags[Number(index)]}
								</lukso-tag>
							</div>
						))
					) : (
						<></>
					)}
				</div>
				{error || description}
				{children}
			</div>
		</lukso-card>
	);
};

export default UniversalProfileCard;
