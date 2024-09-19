import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { parsePrescription } from '../utils/dataExtraction';
import { createPrescription, getPrescription, deletePrescription } from '../services/prescriptionService';

const PrescriptionParser = ({ userId, onParsed }) => {
    const [prescriptionText, setPrescriptionText] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [error, setError] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Modal state
    const [selectedPrescription, setSelectedPrescription] = useState(null); // To track which prescription to delete

    useEffect(() => {
        async function getPrescriptionData() {
            const prescriptionList = await getPrescription(userId);
            setPrescriptions(prescriptionList);
            onParsed(prescriptionList);
        }
        getPrescriptionData();
    }, [userId, onParsed]);

    const handleParse = async () => {
        try {
            const parsedData = await parsePrescription(prescriptionText);
            const savedPrescription = await createPrescription(userId, parsedData);
            setPrescriptions([...prescriptions, savedPrescription]);
            onParsed(prescriptions);
            setError('');
            setPrescriptionText('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Open the delete confirmation modal
    const handleOpenDeleteDialog = (prescription) => {
        setSelectedPrescription(prescription);
        setOpenDeleteDialog(true);
    };

    // Close the delete confirmation modal
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedPrescription(null);
    };

    // Delete the prescription from Firestore
    const handleDeletePrescription = async () => {
        if (selectedPrescription) {
            await deletePrescription(selectedPrescription.id);
            const newPrescriptions = prescriptions.filter(prescription => prescription.id !== selectedPrescription.id);
            setPrescriptions(newPrescriptions);
            onParsed(newPrescriptions);
            handleCloseDeleteDialog();
        }
    };

    return (
        <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h6">Prescription Parser</Typography>
            <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder={
                    `Enter prescription text here...
                    Ex:
                    Amoxicillin
                    250 mg
                    3 times a day
                    7 days
                `}
                style={{ marginBottom: 16 }}
            />
            <Button variant="contained" color="primary" onClick={handleParse}>
                Parse Prescription
            </Button>
            {error && <Typography color="error">{error}</Typography>}

            {/* Table to display the parsed prescriptions */}
            {prescriptions.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: 16 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Medication</TableCell>
                                <TableCell>Dosage</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prescriptions.map((prescription, index) => (
                                <TableRow key={index}>
                                    <TableCell>{prescription.medication}</TableCell>
                                    <TableCell>{`${prescription.dosage.amount} ${prescription.dosage.unit}`}</TableCell>
                                    <TableCell>{`Every ${prescription.frequency.intervalHours} hours`}</TableCell>
                                    <TableCell>{`${prescription.duration.amount} ${prescription.duration.unit}`}</TableCell>
                                    <TableCell>{prescription.time}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDeleteDialog(prescription)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Prescription</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this prescription?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeletePrescription} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default PrescriptionParser;
