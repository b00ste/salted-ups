import { useState } from 'react';

/// ------ Components ------
import Connect from './components/Connect';
import Select from './components/Select';
import Deploy from './components/Deploy';
import DeployedUPs from './components/DeployedUPs';
/// ------------------------

function App() {
	const [error, setError] = useState<JSX.Element>();
	const [connected, setConnected] = useState(false);
	const [saltedUniversalProfile, setSaltedUniversalProfile] = useState<{
		salt: string;
		address: string;
	}>();

	return (
		<div className="min-h-screen relative m-0">
			<Connect setError={setError} setConnected={setConnected} />
			<div className="m-4">
				<lukso-card variant="basic" size="medium">
					<div slot="content" className="p-6">
						<Select
							connected={connected}
							setError={setError}
							saltedUniversalProfile={saltedUniversalProfile}
							setSaltedUniversalProfile={
								setSaltedUniversalProfile
							}
						/>

						<div
							className={`${
								saltedUniversalProfile && connected
									? 'opacity-100 flex'
									: 'opacity-0 hidden'
							} flex-col items-center mt-6 transition-all`}
						>
							<div className="w-60">
								<Deploy
									setError={setError}
									saltedUniversalProfile={
										saltedUniversalProfile
									}
								/>
							</div>
						</div>
					</div>
				</lukso-card>
			</div>
			{connected ? (
				<div className="p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 animate-fade-in">
					<DeployedUPs connected={connected} setError={setError} />
				</div>
			) : (
				<div className="m-4">
					<lukso-card variant="basic" size="medium">
						<div slot="content" className="p-6">
							<p className="p-4">
								Connect with the UP Browser Extension to Deploy
								& Import Salted Ups
							</p>
						</div>
					</lukso-card>
				</div>
			)}
			{error ? (
				<lukso-modal is-open>
					<div className="p-6">
						{error}
						<p className="pt-6">
							<lukso-button
								is-full-width
								variant="landing"
								onClick={() => setError(undefined)}
							>
								Close
							</lukso-button>
						</p>
					</div>
				</lukso-modal>
			) : (
				<></>
			)}
		</div>
	);
}

export default App;
