import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useEditSetting } from './useEditSetting';
import { useSettings } from './useSettings';

function UpdateSettingsForm() {

  const {isLoading, settingData} = useSettings();

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
    } = settingData || {};
 
  const {isLoading: settingUpdating, mutate: settingUpdate } = useEditSetting();

  if(isLoading) return <Spinner/>
  
  function handleUpdates(e, setting){
    const { value } = e.target;
    console.log(value, setting);

    if(!e) return;

    settingUpdate({[setting ]: value});
  }

  return (
    <Form >
      <FormRow label='Minimum nights/booking'>
        <Input type='number' id='min-nights' defaultValue={minBookingLength} disabled={settingUpdating} onBlur={(e)=>handleUpdates(e, "minBookingLength")} />
      </FormRow>
      <FormRow label='Maximum nights/booking'>
        <Input type='number' id='max-nights' defaultValue={maxBookingLength} disabled={settingUpdating} onBlur={(e)=>handleUpdates(e, "maxBookingLength")} />
      </FormRow>
      <FormRow label='Maximum guests/booking'>
        <Input type='number' id='max-guests' defaultValue={maxGuestsPerBooking} disabled={settingUpdating} onBlur={(e)=>handleUpdates(e, "maxGuestsPerBooking")} />
      </FormRow>
      <FormRow label='Breakfast price'>
        <Input type='number' id='breakfast-price' defaultValue={breakfastPrice} disabled={settingUpdating} onBlur={(e)=>handleUpdates(e, "breakfastPrice")}/>
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
